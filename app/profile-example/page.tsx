import Link from "next/link";
import Image from "next/image";

export default function ProfileExamplePage() {
  return (
    <main className="min-h-screen overflow-auto bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-8">
          <Link
            href="/demowelcome"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white mb-4"
          >
            ← Back to 3F Impact Hub
          </Link>
          <h1 className="text-3xl font-bold sm:text-4xl">Example User Profile</h1>
          <p className="mt-2 text-sm text-white/70">
            See how individual users will view their stats and stay engaged.
          </p>
        </div>

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
      </div>
    </main>
  );
}
