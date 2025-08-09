import { cookies } from "next/headers";
import { generateAdminToken, generateToken, verifyAccessToken, verifyAdminAccessToken, verifyAdminRefreshToken, verifyRefreshToken } from "./auth";
export async function getValidAccessToken() {
  const cookieStore = cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    try {
      const adminPayload = verifyAdminAccessToken ? verifyAdminAccessToken(accessToken) : null;
      if (adminPayload) return { token: accessToken, payload: adminPayload, isAdmin: true };
    } catch {}

    try {
      const userPayload = verifyAccessToken(accessToken);
      if (userPayload) return { token: accessToken, payload: userPayload, isAdmin: false };
    } catch {}
  }
  if (refreshToken) {
    try {
      const adminRefreshPayload = verifyAdminRefreshToken ? verifyAdminRefreshToken(refreshToken) : null;
      if (adminRefreshPayload) {
        const newAdminAccessToken = await generateAdminToken(adminRefreshPayload);
        return { token: newAdminAccessToken, payload: adminRefreshPayload, isAdmin: true };
      }
    } catch {}

    try {
      const userRefreshPayload = verifyRefreshToken(refreshToken);
      if (userRefreshPayload) {
        const newUserAccessToken = await generateToken(userRefreshPayload);
        return { token: newUserAccessToken, payload: userRefreshPayload, isAdmin: false };
      }
    } catch {}
  }

  return null;
}
