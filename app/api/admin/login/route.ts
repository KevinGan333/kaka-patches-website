import { cookies } from "next/headers";
import { createHmac } from "crypto";

export const runtime = "nodejs";

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminUser || !adminPass || !sessionSecret) {
      return Response.json({ success: false, message: "Admin not configured." }, { status: 500 });
    }

    if (username !== adminUser || password !== adminPass) {
      return Response.json({ success: false, message: "Invalid credentials." }, { status: 401 });
    }

    const expires = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
    const tokenPayload = `${username}:${expires}`;
    const token = sign(tokenPayload, sessionSecret);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", `${tokenPayload}.${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(expires),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return Response.json({ success: false, message: "Login failed." }, { status: 500 });
  }
}
