import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Canonical home is /f3serve; redirect so old links still work.
 */
export default function F3ServeOpportunitiesPage() {
  redirect("/f3serve");
}
