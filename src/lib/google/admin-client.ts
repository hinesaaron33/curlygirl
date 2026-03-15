import { google } from "googleapis";
import { getValidAccessToken } from "./drive";
import { getSubscriberDrive } from "./oauth";

export async function getAdminDrive(userId: string) {
  const accessToken = await getValidAccessToken(userId);
  return getSubscriberDrive(accessToken);
}

export async function getAdminSheets(userId: string) {
  const accessToken = await getValidAccessToken(userId);
  const client = new google.auth.OAuth2();
  client.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth: client });
}
