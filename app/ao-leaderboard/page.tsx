import Image from "next/image";
import Link from "next/link";
import {
  aos,
  getProjectsForAo,
  getUsersForAo,
  projectMemberships,
  projects,
  users,
} from "@/lib/f3service-demo-data";

const RANK_LABELS: Record<number, { label: string; ring: string; badge: string }> = {
  1: { label: "1st", ring: "ring-yellow-400", badge: "bg-yellow-400 text-black" },
  2: { label: "2nd", ring: "ring-white/50", badge: "bg-white/20 text-white" },
  3: { label: "3rd", ring: "ring-white/30", badge: "bg-white/10 text-white/80" },
};

export default function AOLeaderboardPage() {
  // --- AO leaderboard ---
  const leaderboard = aos
    .map((ao) => {
      const members = getUsersForAo(ao.id);
      const aoProjects = getProjectsForAo(ao.id);
      const projectIds = new Set(aoProjects.map((p) => p.f3ProjectId));
      const joinedCount = projectMemberships.filter((m) =>
        projectIds.has(m.f3ProjectId)
      ).length;
      const totalHours = members.reduce((sum, m) => sum + m.totalHours, 0);
      const goalPct = Math.min(
        100,
        Math.round((totalHours / ao.quarterlyGoalHours) * 100)
      );
      return { ao, members, projects: aoProjects, joinedCount, totalHours, goalPct };
    })
    .sort((a, b) => b.totalHours - a.totalHours);

  // --- T-Claps HIMs: top 3 by total hours ---
  const topHims = [...users]
    .filter((u) => u.totalHours > 0)
    .sort((a, b) => b.totalHours - a.totalHours)
    .slice(0, 3);

  // --- Spotlight: most recent completed project ---
  const spotlight = projects
    .filter((p) => p.isCompleted)
    .sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )[0];

  const spotlightParticipants = spotlight
    ? projectMemberships
        .filter((m) => m.f3ProjectId === spotlight.f3ProjectId)
        .map((m) => users.find((u) => u.id === m.userId))
        .filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">

        {/* ── Page header ── */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            F3 Capital · Q1 Standings
          </p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
            AO Leaderboard
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Rankings by total service hours and project activity across the region.
          </p>
        </div>

        {/* ══════════════════════════════════════════
            T-CLAPS — Standout HIMs
        ══════════════════════════════════════════ */}
        {topHims.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-2xl">👏</span>
              <h2 className="text-xl font-bold tracking-tight">T-Claps</h2>
              <span className="text-sm text-white/50">— Standout HIMs this quarter</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {topHims.map((him, i) => {
                const rank = i + 1;
                const style = RANK_LABELS[rank] ?? {
                  label: `${rank}th`,
                  ring: "ring-white/20",
                  badge: "bg-white/10 text-white/60",
                };
                const ao = aos.find((a) => a.id === him.aoId);
                return (
                  <div
                    key={him.id}
                    className={`relative rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm ${
                      rank === 1 ? "border-yellow-400/30 bg-yellow-400/5" : ""
                    }`}
                  >
                    {/* rank badge */}
                    <span
                      className={`absolute right-4 top-4 rounded-full px-2 py-0.5 text-xs font-bold ${style.badge}`}
                    >
                      {style.label}
                    </span>

                    <div className="flex items-center gap-3">
                      <Image
                        src={him.avatarUrl}
                        alt={him.f3Name}
                        width={48}
                        height={48}
                        className={`h-12 w-12 rounded-full ring-2 ${style.ring} object-cover`}
                      />
                      <div>
                        <p
                          className={`text-base font-bold leading-tight ${
                            rank === 1 ? "text-yellow-300" : "text-white"
                          }`}
                        >
                          {him.f3Name}
                        </p>
                        <p className="text-xs text-white/50">{him.name}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-extrabold leading-none">
                          {him.totalHours}
                          <span className="ml-1 text-sm font-normal text-white/50">hrs</span>
                        </p>
                        <p className="mt-0.5 text-xs text-white/40">service this quarter</p>
                      </div>
                      {ao && (
                        <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/60">
                          AO: {ao.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════
            SPOTLIGHT PROJECT
        ══════════════════════════════════════════ */}
        {spotlight && (
          <section className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <h2 className="text-xl font-bold tracking-tight">Spotlight Project</h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/60">
                Completed
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
              <div className="relative h-48 w-full sm:h-64">
                <Image
                  src={spotlight.photoUrl}
                  alt={spotlight.title}
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    {spotlight.locationName}
                  </p>
                  <h3 className="text-2xl font-extrabold leading-tight text-white">
                    {spotlight.title}
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm leading-relaxed text-white/70">
                  {spotlight.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-white/40">Hours</p>
                    <p className="text-lg font-bold">{spotlight.hoursWorking}h</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40">HIMs who served</p>
                    <div className="mt-1 flex -space-x-2">
                      {spotlightParticipants.map((u) =>
                        u ? (
                          <Image
                            key={u.id}
                            src={u.avatarUrl}
                            alt={u.f3Name}
                            width={28}
                            height={28}
                            title={u.f3Name}
                            className="h-7 w-7 rounded-full ring-2 ring-black/60 object-cover"
                          />
                        ) : null
                      )}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/60">
                      AO:{" "}
                      {aos.find((a) => a.id === spotlight.aoId)?.name ?? spotlight.aoId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════
            AO STANDINGS TABLE
        ══════════════════════════════════════════ */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <h2 className="text-xl font-bold tracking-tight">AO Standings</h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
            {leaderboard.map((row, i) => {
              const rank = i + 1;
              const style = RANK_LABELS[rank] ?? {
                label: `${rank}`,
                ring: "ring-white/20",
                badge: "bg-white/10 text-white/60",
              };
              return (
                <div
                  key={row.ao.id}
                  className={`flex flex-col gap-4 border-b border-white/10 px-5 py-5 last:border-0 sm:flex-row sm:items-center ${
                    rank === 1 ? "bg-yellow-400/5" : ""
                  }`}
                >
                  {/* Rank + name */}
                  <div className="flex items-center gap-4 sm:w-40">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${style.badge}`}
                    >
                      {rank}
                    </span>
                    <div>
                      <p
                        className={`text-base font-bold ${
                          rank === 1 ? "text-yellow-300" : "text-white"
                        }`}
                      >
                        {row.ao.name}
                      </p>
                      <p className="text-xs text-white/40">{row.ao.city}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid flex-1 grid-cols-3 gap-2 text-center sm:gap-4">
                    <div>
                      <p className="text-lg font-extrabold leading-none">{row.members.length}</p>
                      <p className="mt-0.5 text-xs text-white/40">Members</p>
                    </div>
                    <div>
                      <p className="text-lg font-extrabold leading-none">{row.projects.length}</p>
                      <p className="mt-0.5 text-xs text-white/40">Projects</p>
                    </div>
                    <div>
                      <p
                        className={`text-lg font-extrabold leading-none ${
                          rank === 1 ? "text-yellow-300" : ""
                        }`}
                      >
                        {row.totalHours}h
                      </p>
                      <p className="mt-0.5 text-xs text-white/40">Total hrs</p>
                    </div>
                  </div>

                  {/* Quarterly goal progress */}
                  <div className="sm:w-44">
                    <div className="flex justify-between text-xs text-white/40 mb-1">
                      <span>Q1 goal</span>
                      <span>{row.goalPct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${
                          rank === 1 ? "bg-yellow-400" : "bg-white/40"
                        }`}
                        style={{ width: `${row.goalPct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-white/30">
                      of {row.ao.quarterlyGoalHours}h
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Back link */}
        <Link
          href="/demowelcome"
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
        >
          ← Back to 3F Impact Hub
        </Link>
      </div>
    </main>
  );
}
