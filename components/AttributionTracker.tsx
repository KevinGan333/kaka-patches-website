"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordVisit } from "@/lib/attribution-client";
export default function AttributionTracker() {
  const pathname = usePathname();
  useEffect(() => { recordVisit(); }, [pathname]);
  return null;
}
