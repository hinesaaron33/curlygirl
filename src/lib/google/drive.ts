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

/* Works for any file type (Slides, Docs, PDFs) — Google redirects to the
 * right viewer/editor. */
export function driveOpenUrl(fileId: string) {
  return `https://drive.google.com/open?id=${fileId}`;
}

const DELIVERY_FOLDER_NAME = "Curly Girl ELD — Deliveries";

/*
 * Delivery runs on the ADMIN account's Drive client, not the subscriber's.
 * Subscribers never grant Drive access (their OAuth only shares an email);
 * instead the admin account copies its own source file and shares the copy
 * to the subscriber's Google email as a writer, so each subscriber gets a
 * private editable copy.
 */
async function getDeliveryDrive() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN", googleRefreshToken: { not: null } },
    select: { id: true },
  });

  if (!admin) {
    throw new Error(
      "Lesson delivery is temporarily unavailable — admin Google account not connected"
    );
  }

  const accessToken = await getValidAccessToken(admin.id);
  return getSubscriberDrive(accessToken);
}

type DriveClient = Awaited<ReturnType<typeof getDeliveryDrive>>;

async function ensureDeliveryFolder(drive: DriveClient): Promise<string> {
  const existing = await drive.files.list({
    q: `name = '${DELIVERY_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    pageSize: 1,
  });

  const found = existing.data.files?.[0]?.id;
  if (found) return found;

  const created = await drive.files.create({
    requestBody: {
      name: DELIVERY_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  if (!created.data.id) {
    throw new Error("Failed to create delivery folder");
  }
  return created.data.id;
}

export async function deliverLessonToSubscriber(
  userId: string,
  lessonPlanId: string
) {
  // Check access
  const access = await checkCopyAccess(userId, lessonPlanId);
  if (!access.allowed) {
    throw new Error(access.reason);
  }

  // Idempotency: a lesson already delivered just returns the existing copy
  const existing = await prisma.driveCopyLog.findFirst({
    where: { userId, lessonPlanId },
    orderBy: { copiedAt: "desc" },
  });
  if (existing) {
    return {
      fileId: existing.copiedFileId,
      url: driveOpenUrl(existing.copiedFileId),
      alreadyDelivered: true,
    };
  }

  const lessonPlan = await prisma.lessonPlan.findUniqueOrThrow({
    where: { id: lessonPlanId },
    select: { googleDriveFileId: true, title: true },
  });

  if (!lessonPlan.googleDriveFileId) {
    throw new Error("Lesson plan has no linked Drive file");
  }

  const subscriber = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { googleEmail: true },
  });

  if (!subscriber.googleEmail) {
    throw new Error("Connect your Google account to receive lessons");
  }

  const drive = await getDeliveryDrive();
  const folderId = await ensureDeliveryFolder(drive);

  const copy = await drive.files.copy({
    fileId: lessonPlan.googleDriveFileId,
    requestBody: {
      name: lessonPlan.title,
      parents: [folderId],
    },
    fields: "id, webViewLink",
  });

  if (!copy.data.id) {
    throw new Error("Drive copy failed — no file ID returned");
  }

  await drive.permissions.create({
    fileId: copy.data.id,
    requestBody: {
      role: "writer",
      type: "user",
      emailAddress: subscriber.googleEmail,
    },
    sendNotificationEmail: true,
    emailMessage: `Your lesson "${lessonPlan.title}" from Curly Girl ELD is ready! It's been shared with you as your own editable copy.`,
  });

  await prisma.driveCopyLog.create({
    data: {
      userId,
      lessonPlanId,
      copiedFileId: copy.data.id,
    },
  });

  return {
    fileId: copy.data.id,
    url: copy.data.webViewLink ?? driveOpenUrl(copy.data.id),
    alreadyDelivered: false,
  };
}
