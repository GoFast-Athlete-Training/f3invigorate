import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDate,
  getAo,
  getF3ProjectBySlug,
  getMembershipsForProject,
  getOpportunity,
  getOrg,
  getUser,
} from "@/lib/f3service-demo-data";

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
  const template = getOpportunity(project.opportunityId);
  const org = template ? getOrg(template.orgId) : null;
  const members = getMembershipsForProject(project.f3ProjectId);

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
              <p className="text-xs text-gray-500">Public Project Container</p>
            </div>
          </div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-3">
        <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {ao?.name ?? "AO"} · {org?.name ?? "Community partner"}
              </p>
            </div>
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              {!project.isCompleted ? "OPEN TO JOIN" : "COMPLETED"}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500">Project Name</p>
              <p className="font-medium text-gray-900">{project.title}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500">Start Time</p>
              <p className="font-medium text-gray-900">{formatDate(project.startTime)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500">Hours Working</p>
              <p className="font-medium text-gray-900">{project.hoursWorking}h</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            <p className="mt-2 text-gray-700">{project.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Join Project
            </button>
            <p className="text-sm text-gray-500">Demo mode: public hydration only.</p>
          </div>
        </section>

        <aside className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Who&apos;s Joining</h2>
          <p className="mt-1 text-sm text-gray-600">{members.length} members joined</p>
          <ul className="mt-4 space-y-3">
            {members.map((membership) => {
              const user = getUser(membership.userId);
              return (
                <li
                  key={membership.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name ?? membership.userId}
                  </p>
                  <p className="text-xs text-gray-600">{user?.email ?? "No email"}</p>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </main>
  );
}
