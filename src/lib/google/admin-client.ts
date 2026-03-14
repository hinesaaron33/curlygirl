import { google } from "googleapis";
import type { drive_v3 } from "googleapis";

let _drive: drive_v3.Drive | null = null;

export function getAdminDrive() {
  if (!_drive) {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    if (!email || !key) {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY must be set"
      );
    }

    const auth = new google.auth.JWT({
      email,
      key: key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    _drive = google.drive({ version: "v3", auth });
  }
  return _drive;
}
