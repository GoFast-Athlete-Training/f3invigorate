import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAo,
  getF3ProjectBySlug,
  getMembershipsForProject,
  getUser,
} from "@/lib/f3service-demo-data";
import ProjectOpportunityClient from "./ProjectOpportunityClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PublicProjectContainerPage({ params }: Props) {
  const { slug } = await params;
  const project = getF3ProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const ao = getAo(project.aoId);
  const members = getMembershipsForProject(project.f3ProjectId);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.googleMapsPlace)}`;
  const startDate = new Date(project.startTime);
  const endDate = new Date(project.endTime ?? project.startTime);
  const dateLabel = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
  const startTimeLabel = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTimeLabel = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const initialMembers = members
    .map((membership) => {
      const user = getUser(membership.userId);
      if (!user) return null;
      return {
        id: user.id,
        f3Name: user.f3Name,
        avatarUrl: user.avatarUrl,
      };
    })
    .filter((member): member is { id: string; f3Name: string; avatarUrl: string } => !!member);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/f3-capital-logo.png"
              alt="F3 Capital logo"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">F3 Capital Impact</p>
              <p className="text-xs text-gray-500">Project Opportunity</p>
            </div>
          </div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Home
          </Link>
        </div>
      </header>

      <ProjectOpportunityClient
        title={project.title}
        sponsoringAo={ao?.name ? `The ${ao.name}` : "Unassigned"}
        photoUrl={project.photoUrl}
        description={project.description}
        whatYoullDo={
          project.whatYoullDo ??
          "Show up ready to serve, work with your AO brothers, and complete community support tasks."
        }
        dateLabel={dateLabel}
        startTimeLabel={startTimeLabel}
        endTimeLabel={endTimeLabel}
        address={project.address ?? project.locationName}
        postProjectCoffeeLocation={
          project.postProjectCoffeeLocation ?? "Compass Coffee"
        }
        mapUrl={mapUrl}
        initialMembers={initialMembers}
      />
    </main>
  );
}
