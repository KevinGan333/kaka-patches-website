import { cookies } from "next/headers";
import { createHmac } from "crypto";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!session?.value || !sessionSecret) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  const parts = session.value.split(".");
  if (parts.length !== 2) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  const [payload, sig] = parts;
  const expected = createHmac("sha256", sessionSecret).update(payload).digest("hex");

  if (sig !== expected) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  const [username, expiresStr] = payload.split(":");
  if (Date.now() > Number(expiresStr)) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  return Response.json({ authenticated: true, username });
}
