import { recordVisit } from "@/lib/attribution-client";
// Capture the entry before a visitor can navigate away from the landing page.
recordVisit();
