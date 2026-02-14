import { redirect } from "next/navigation";

/**
 * Legacy /register → signup. Used by Volunteer Match links (e.g. f3capitalimpact.org/register).
 */
export default function RegisterPage() {
  redirect("/signup");
}
