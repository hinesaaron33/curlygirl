import { prisma } from "@/lib/db/prisma";
import { TIER_LIMITS } from "@/lib/stripe/config";
import { decrypt } from "./token-encryption";
import { refreshAccessToken, getSubscriberDrive } from "./oauth";
import { encrypt } from "./token-encryption";

export async function checkCopyAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user?.subscription || user.subscription.status !== "ACTIVE") {
    return { allowed: false, reason: "Active subscription required" } as const;
  }

  const tier = user.subscription.tier;
  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS];

  if (!limits) {
    return { allowed: false, reason: "Unknown subscription tier" } as const;
  }

  // Count copies this billing period
  const periodStart = user.subscription.currentPeriodStart ?? new Date(0);
  const copyCount = await prisma.driveCopyLog.count({
    where: {
      userId,
      copiedAt: { gte: periodStart },
    },
  });

  if (copyCount >= limits.downloadsPerMonth) {
    return {
      allowed: false,
      reason: `Copy limit reached (${limits.downloadsPerMonth}/month)`,
    } as const;
  }

  return { allowed: true, remaining: limits.downloadsPerMonth - copyCount } as const;
}

async function getValidAccessToken(userId: string): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiry: true,
    },
  });

  if (!user.googleAccessToken || !user.googleRefreshToken) {
    throw new Error("Google account not connected");
  }

  const accessToken = decrypt(user.googleAccessToken);
  const refreshToken = decrypt(user.googleRefreshToken);

  // If token expires within 5 minutes, refresh it
  const expiresAt = user.googleTokenExpiry?.getTime() ?? 0;
  if (Date.now() > expiresAt - 5 * 60 * 1000) {
    const credentials = await refreshAccessToken(refreshToken);
    if (!credentials.access_token) {
      throw new Error("Failed to refresh Google token");
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: encrypt(credentials.access_token),
        googleTokenExpiry: credentials.expiry_date
          ? new Date(credentials.expiry_date)
          : null,
      },
    });

    return credentials.access_token;
  }

  return accessToken;
}

export async function copyFileToSubscriber(
  userId: string,
  lessonPlanId: string
) {
  // Check access
  const access = await checkCopyAccess(userId);
  if (!access.allowed) {
    throw new Error(access.reason);
  }

  // Get the lesson plan's Drive file ID
  const lessonPlan = await prisma.lessonPlan.findUniqueOrThrow({
    where: { id: lessonPlanId },
    select: { googleDriveFileId: true, title: true },
  });

  if (!lessonPlan.googleDriveFileId) {
    throw new Error("Lesson plan has no linked Drive file");
  }

  // Get subscriber's valid access token
  const accessToken = await getValidAccessToken(userId);
  const drive = getSubscriberDrive(accessToken);

  // Copy the file to subscriber's Drive
  const copy = await drive.files.copy({
    fileId: lessonPlan.googleDriveFileId,
    requestBody: {
      name: lessonPlan.title,
    },
  });

  if (!copy.data.id) {
    throw new Error("Drive copy failed — no file ID returned");
  }

  // Log the copy
  await prisma.driveCopyLog.create({
    data: {
      userId,
      lessonPlanId,
      copiedFileId: copy.data.id,
    },
  });

  return {
    fileId: copy.data.id,
    url: `https://docs.google.com/presentation/d/${copy.data.id}/edit`,
  };
}
