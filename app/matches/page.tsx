import { listMatches } from "@/lib/db/matches";
import { getJobs } from "@/lib/db/jobs";
import Link from "next/link";
import { Topbar } from "@/app/_components/topbar";

export default async function MatchesPage() {
  const matches = await listMatches();
  const jobs = await getJobs();
  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  return (
    <div className="flex min-h-full flex-col">
      <Topbar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
          <section className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Recruitment Matches
            </h1>
            <p className="text-muted-foreground">
              Review and analyze candidate matches for your active job descriptions.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const job = jobMap.get(match.jobId);
              return (
                <Link key={match.id} href={`/matches/${match.id}`} className="group">
                  <article className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_20px_50px_rgba(18,38,79,0.06)] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(18,38,79,0.1)]">
                    <header className="flex items-center justify-between border-b border-line px-6 py-5">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {match.candidateName}
                      </h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${getScoreColors(match.score)}`}>
                        {match.score}%
                      </span>
                    </header>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Applied For
                          </p>
                          <p className="text-base font-medium text-foreground truncate">
                            {job?.title || "Unknown Job"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Recommendation
                          </p>
                          <p className={`text-base font-semibold ${getLabelColor(match.recommendationLabel)}`}>
                            {match.recommendationLabel.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <footer className="mt-6 flex items-center justify-between border-t border-line pt-4">
                        <p className="text-xs text-muted-foreground">
                          {new Date(match.createdAt).toLocaleDateString()}
                        </p>
                        <span className="text-sm font-medium text-primary group-hover:underline">
                          View Analysis →
                        </span>
                      </footer>
                    </div>
                  </article>
                </Link>
              );
            })}
            {matches.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-[22px] border-2 border-dashed border-line bg-surface-muted/30">
                <p className="text-xl font-medium text-muted-foreground">No matches found yet</p>
                <p className="text-sm text-muted-foreground mt-2">Generate matches from the JD Analyzer or Resume Parser.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function getScoreColors(score: number) {
  if (score >= 80) return "bg-[#eaf9ee] text-[#13803c]";
  if (score >= 60) return "bg-[#fff9e6] text-[#b25e09]";
  return "bg-[#fff1f1] text-[#ef4444]";
}

function getLabelColor(label: string) {
  switch (label) {
    case "strong_fit":
      return "text-[#13803c]";
    case "good_fit":
      return "text-[#2450d6]";
    case "stretch":
      return "text-[#b25e09]";
    case "not_recommended":
      return "text-[#ef4444]";
    default:
      return "text-foreground";
  }
}
