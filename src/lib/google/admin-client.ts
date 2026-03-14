import { getValidAccessToken } from "./drive";
import { getSubscriberDrive } from "./oauth";

export async function getAdminDrive(userId: string) {
  const accessToken = await getValidAccessToken(userId);
  return getSubscriberDrive(accessToken);
}
