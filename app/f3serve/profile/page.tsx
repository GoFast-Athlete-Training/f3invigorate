import { getCurrentF3HIM } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VolunteerProfileForm from "./VolunteerProfileForm";

export const dynamic = "force-dynamic";

export default async function F3ServeProfilePage() {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    redirect("/login?next=/f3serve/profile");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
      <p className="mt-2 text-gray-600">Personal info, causes you care about, and volunteer preferences.</p>
      <div className="mt-6 max-w-xl">
        <VolunteerProfileForm
          initial={{
            photoURL: f3him.photoURL ?? "",
            bio: f3him.bio ?? "",
            phoneNumber: f3him.phoneNumber ?? "",
            city: f3him.city ?? "",
            state: f3him.state ?? "",
            myCauses: f3him.myCauses ?? [],
            volunteerSkills: f3him.volunteerSkills ?? "",
            availability: f3him.availability ?? "",
          }}
        />
      </div>
    </div>
  );
}
