import Link from "next/link";
import { aos, opportunities, orgs, getActivationsForTemplate } from "@/lib/f3service-demo-data";
import { ServiceEngineNav } from "../_components/ServiceEngineNav";

export default function OrgTemplatesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Org Template Page</h1>
      <p className="text-gray-600">Browse org templates and adopt events into an AO.</p>
      <ServiceEngineNav activeHref="/f3service-demo/orgs" />

      <section className="grid grid-cols-1 gap-5">
        {orgs.map((org) => (
          <article key={org.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{org.name}</h2>
                <p className="text-sm text-gray-600">Category: {org.category}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {org.mission}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-700">
              <a href={org.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                {org.website}
              </a>
            </p>

            <div className="mt-4 space-y-4">
              {opportunities
                .filter((opp) => opp.orgId === org.id)
                .map((opp) => {
                  const activeCopies = getActivationsForTemplate(opp.id);
                  const activeCopyText = activeCopies.length
                    ? `${activeCopies.length} AO${activeCopies.length === 1 ? "" : "s"} adopted`
                    : "Not adopted yet";

                  return (
                    <div key={opp.id} className="rounded-lg border border-gray-100 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">{opp.title}</p>
                          <p className="text-sm text-gray-600">Location: {opp.location}</p>
                          <p className="text-xs text-gray-500">{activeCopyText}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{opp.description}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <p className="text-xs text-gray-500 w-full">Adopt for AO:</p>
                        {aos.map((ao) => (
                          <button
                            key={`${opp.id}-${ao.id}`}
                            type="button"
                            className="rounded-md border border-blue-200 bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium"
                          >
                            {ao.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </article>
        ))}
      </section>

      <Link href="/f3service-demo/ao" className="inline-flex text-blue-600 hover:underline">
        Back to AO dashboard →
      </Link>
    </div>
  );
}
