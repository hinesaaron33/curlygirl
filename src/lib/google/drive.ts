import { prisma } from "@/lib/db/prisma";
import { decrypt } from "./token-encryption";
import { refreshAccessToken, getSubscriberDrive } from "./oauth";
import { encrypt } from "./token-encryption";

const GRACE_PERIOD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function isWithinGracePeriod(canceledAt: Date | null): boolean {
  if (!canceledAt) return false;
  return Date.now() - canceledAt.getTime() < GRACE_PERIOD_MS;
}

export async function checkCopyAccess(userId: string, lessonPlanId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user?.subscription) {
    return { allowed: false, reason: "Active subscription required" } as const;
  }

  const sub = user.subscription;
  const isActive = sub.status === "ACTIVE";
  const inGracePeriod = isWithinGracePeriod(sub.canceledAt);

  // Check subscription expired grace period
  if (sub.canceledAt && !inGracePeriod) {
    return { allowed: false, reason: "Subscription expired" } as const;
  }

  if (!isActive && !inGracePeriod) {
    return { allowed: false, reason: "Active subscription required" } as const;
  }

  // Check if lesson is in user's tier bundle
  const bundleAccess = await prisma.bundleLessonPlan.findFirst({
    where: {
      lessonPlanId,
      bundle: { tier: sub.tier },
    },
  });

  if (bundleAccess) {
    return { allowed: true, source: "bundle" } as const;
  }

  // Check if user already purchased this lesson with credits
  const lessonAccess = await prisma.userLessonAccess.findUnique({
    where: { userId_lessonPlanId: { userId, lessonPlanId } },
  });

  if (lessonAccess) {
    return { allowed: true, source: "credit" } as const;
  }

  return { allowed: false, reason: "Use 1 credit to unlock this lesson" } as const;
}

export async function purchaseWithCredit(userId: string, lessonPlanId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user?.subscription || user.subscription.creditsBalance < 1) {
    throw new Error("Insufficient credits");
  }

  // Check not already owned
  const existing = await prisma.userLessonAccess.findUnique({
    where: { userId_lessonPlanId: { userId, lessonPlanId } },
  });

  if (existing) {
    return; // Already owned, no-op
  }

  await prisma.$transaction([
    prisma.subscription.update({
      where: { userId },
      data: { creditsBalance: { decrement: 1 } },
    }),
    prisma.userLessonAccess.create({
      data: { userId, lessonPlanId },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        lessonPlanId,
        amount: 1,
        type: "SPEND",
      },
    }),
  ]);
}

export async function getValidAccessToken(userId: string): Promise<string> {
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
  const access = await checkCopyAccess(userId, lessonPlanId);
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
