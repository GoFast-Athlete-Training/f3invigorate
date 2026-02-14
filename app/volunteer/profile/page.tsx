import { getCurrentF3HIM } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VolunteerProfileForm from "./VolunteerProfileForm";

export const dynamic = "force-dynamic";

export default async function VolunteerProfilePage() {
  const f3him = await getCurrentF3HIM();
  if (!f3him) {
    redirect("/login?next=/volunteer/profile");
  }

  const profile = await prisma.volunteerProfile.findUnique({
    where: { f3himId: f3him.id },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Volunteer Profile</h1>
      <p className="mt-2 text-gray-600">Skills, interests, and availability (used for matching).</p>
      <div className="mt-6 max-w-xl">
        <VolunteerProfileForm
          initial={{
            skills: profile?.skills ?? [],
            interests: profile?.interests ?? [],
            availability: profile?.availability ?? "",
            commitmentPreference: profile?.commitmentPreference ?? "ONE_TIME",
            remotePreference: profile?.remotePreference ?? false,
          }}
        />
      </div>
    </div>
  );
}
