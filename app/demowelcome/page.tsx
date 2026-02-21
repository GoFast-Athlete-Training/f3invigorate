import Link from "next/link";
import Image from "next/image";

const cards = [
  {
    title: "AO-organized Projects",
    description:
      "Hydrates one example project container so you can see the AO project flow, who is joining, and detail behavior.",
    href: "/project/rock-creek-park-restoration",
    cta: "Open Example Project Container",
  },
  {
    title: "See Individual Volunteer Match",
    description:
      "Discover opportunities like Volunteer Match and explore templates from mission-aligned organizations.",
    href: "/f3serve",
    cta: "Open Volunteer Match",
  },
  {
    title: "See Individual Cause Rallying",
    description:
      "Explore cause-focused fundraising and personal impact campaigns for local and national needs.",
    href: "/cause-rallying",
    cta: "Open Cause Rallying",
  },
  {
    title: "See AO Leaderboard",
    description:
      "Compare AO service activity, hours, and participation momentum across the region.",
    href: "/ao-leaderboard",
    cta: "Open AO Leaderboard",
  },
];

export default function DemoWelcomePage() {
  return (
    <main className="min-h-screen overflow-auto bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-7">
        <div className="mb-5 max-w-5xl">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Welcome to the 3F Impact Hub
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            Welcome to the 3F Impact Hub where each AO is motivated to create projects in
            their local communities and give back.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            This hub also functions as a means for individuals to find opportunities (think
            Volunteer Match) and to raise funds for causes they personally support.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
            Demo geography is focused on Washington, DC and Arlington, VA to reflect the
            F3 Capital region.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-base">
            This is a demo experience powered by fake data so you can get a feel for how it
            could work and provide meaningful feedback.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
          {/* Example User Profile Card */}
          <article className="rounded-xl border border-white/20 bg-black/30 p-4 backdrop-blur-sm sm:p-5">
            <h2 className="text-lg font-semibold text-white sm:text-xl">Example User Profile</h2>
            <p className="mt-1 text-sm leading-relaxed text-white/75">
              See how PAX service activity rolls up across group projects and individual commitments.
            </p>
            <Link
              href="#profile"
              className="mt-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              View Profile Example
            </Link>
          </article>

          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-white/20 bg-black/30 p-4 backdrop-blur-sm sm:p-5"
            >
              <h2 className="text-lg font-semibold text-white sm:text-xl">{card.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-white/75">{card.description}</p>
              <Link
                href={card.href}
                className="mt-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                {card.cta}
              </Link>
            </article>
          ))}
        </section>

        <section id="profile" className="mb-8 scroll-mt-6">
          <h2 className="text-2xl font-bold mb-4">Example User Profile</h2>
          <div className="rounded-xl border border-white/20 bg-black/30 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&crop=faces"
                  alt="John Fastlane Smith"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">John &quot;Fastlane&quot; Smith</h3>
                <p className="text-white/75">📍 Charlotte, NC</p>
                <p className="text-white/75">📞 (704) 555-1234</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-white/90 mb-2">Bio</h4>
              <p className="text-sm text-white/75 leading-relaxed">
                10 years Army infantry. Passionate about helping vets transition and working 
                with youth. Let&apos;s make an impact in our community.
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-white/90 mb-2">Causes I Care About</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-md bg-blue-600/20 border border-blue-500/30 px-3 py-1 text-xs font-medium text-blue-300">
                  Veterans
                </span>
                <span className="inline-flex items-center rounded-md bg-green-600/20 border border-green-500/30 px-3 py-1 text-xs font-medium text-green-300">
                  Youth & Kids
                </span>
                <span className="inline-flex items-center rounded-md bg-purple-600/20 border border-purple-500/30 px-3 py-1 text-xs font-medium text-purple-300">
                  Community
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-white/90 mb-2">Home AOs</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/75">Charlotte Metro</span>
                  <span className="inline-flex items-center rounded-md bg-yellow-600/20 border border-yellow-500/30 px-2 py-0.5 text-xs font-medium text-yellow-300">
                    SITE_Q
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/75">Raleigh South</span>
                  <span className="inline-flex items-center rounded-md bg-gray-600/20 border border-gray-500/30 px-2 py-0.5 text-xs font-medium text-gray-300">
                    MEMBER
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mb-6">
              <h4 className="font-semibold text-white/90 mb-3">Service Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-3xl font-bold text-blue-400">47</div>
                  <div className="text-xs text-white/60">Total Hours</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">3</div>
                  <div className="text-xs text-white/60">Projects Joined</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">1</div>
                  <div className="text-xs text-white/60">Projects Organized</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400">2</div>
                  <div className="text-xs text-white/60">External Commitments</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white/90 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-white">Park Cleanup @ Freedom Park</h5>
                      <p className="text-xs text-white/60 mt-1">Group Service Event</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-400">3 hrs</div>
                      <div className="text-xs text-white/50">Complete</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-white">TMF 9/11 Run Support</h5>
                      <p className="text-xs text-white/60 mt-1">Travis Manion Foundation</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-400">4 hrs</div>
                      <div className="text-xs text-white/50">Complete</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-white">Character Does Matter Mentor</h5>
                      <p className="text-xs text-white/60 mt-1">Travis Manion Foundation</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-400">Ongoing</div>
                      <div className="text-xs text-white/50">Recurring</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
