import { cookies } from "next/headers";
import { createHmac } from "crypto";

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!session?.value || !secret) return false;
  const parts = session.value.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  if (sig !== expected) return false;
  const [, expiresStr] = payload.split(":");
  return Date.now() <= Number(expiresStr);
}

export async function requireAdmin(): Promise<void> {
  const ok = await verifyAdminSession();
  if (!ok) {
    const { redirect } = await import("next/navigation");
    redirect("/admin/login");
  }
}
