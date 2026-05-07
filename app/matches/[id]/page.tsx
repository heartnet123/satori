import { getMatch } from "@/lib/db/matches";
import { getJob } from "@/lib/db/jobs";
import { Topbar } from "@/app/_components/topbar";
import { MatchStreamView } from "@/app/_components/match-stream-view";
import { notFound } from "next/navigation";
import { StarIcon, BoltIcon } from "@/app/_components/icons";

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await getMatch(id);

  if (!match) {
    notFound();
  }

  const job = await getJob(match.jobId);

  return (
    <div className="flex min-h-full flex-col">
      <Topbar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Analysis for {match.candidateName}
              </h1>
              <p className="text-lg text-muted-foreground">
                Matching against <span className="font-medium text-foreground">{job?.title || "Unknown Job"}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <span className={`text-4xl font-bold ${getScoreColor(match.score)}`}>
                    {match.score}%
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">Match Compatibility</span>
               </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-6">
              {/* Main Analysis Sections */}
              <div className="grid gap-6 sm:grid-cols-2">
                <AnalysisCard title="Matched Skills" icon={<StarIcon className="h-5 w-5 text-emerald-500" />} items={match.matchedSkills} color="emerald" />
                <AnalysisCard title="Missing Skills" icon={<BoltIcon className="h-5 w-5 text-amber-500" />} items={match.missingSkills} color="amber" />
                <AnalysisCard title="Key Strengths" icon={<StarIcon className="h-5 w-5 text-blue-500" />} items={match.strengths} color="blue" />
                <AnalysisCard title="Potential Risks" icon={<BoltIcon className="h-5 w-5 text-red-500" />} items={match.risks} color="red" />
              </div>

              {/* Streaming Explanation */}
              <MatchStreamView matchId={match.id} initialExplanation={match.explanation} />
            </div>

            <aside className="flex flex-col gap-6">
              <section className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_20px_50px_rgba(18,38,79,0.06)]">
                <header className="border-b border-line px-6 py-5">
                  <h2 className="text-lg font-semibold text-foreground">Recommendation</h2>
                </header>
                <div className="p-6">
                  <div className={`rounded-2xl p-4 text-center ${getRecommendationBg(match.recommendationLabel)}`}>
                    <p className={`text-xl font-bold uppercase tracking-wider ${getLabelColor(match.recommendationLabel)}`}>
                      {match.recommendationLabel.replace("_", " ")}
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed text-center">
                    Based on the deep analysis of the candidate&apos;s experience and the job requirements.
                  </p>
                </div>
              </section>

              <section className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_20px_50px_rgba(18,38,79,0.06)]">
                <header className="border-b border-line px-6 py-5">
                  <h2 className="text-lg font-semibold text-foreground">Match Meta</h2>
                </header>
                <div className="p-6 space-y-4">
                  <MetaRow label="Candidate" value={match.candidateName} />
                  <MetaRow label="Job ID" value={match.jobId} />
                  <MetaRow label="Processed" value={new Date(match.createdAt).toLocaleString()} />
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function AnalysisCard({ title, icon, items, color }: { title: string; icon: React.ReactNode; items: string[]; color: "emerald" | "amber" | "blue" | "red" }) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    amber: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
    red: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30",
  };

  return (
    <article className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-sm">
      <header className="flex items-center gap-3 border-b border-line px-6 py-4">
        {icon}
        <h3 className="font-semibold text-foreground">{title}</h3>
      </header>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <span key={idx} className={`rounded-full border px-3 py-1 text-xs font-medium ${colorClasses[color]}`}>
              {item}
            </span>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground italic">None identified</p>
          )}
        </div>
      </div>
    </article>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{value}</span>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-[#13803c]";
  if (score >= 60) return "text-[#b25e09]";
  return "text-[#ef4444]";
}

function getRecommendationBg(label: string) {
  switch (label) {
    case "strong_fit": return "bg-[#eaf9ee]";
    case "good_fit": return "bg-[#eef2ff]";
    case "stretch": return "bg-[#fff9e6]";
    case "not_recommended": return "bg-[#fff1f1]";
    default: return "bg-surface-muted";
  }
}

function getLabelColor(label: string) {
  switch (label) {
    case "strong_fit": return "text-[#13803c]";
    case "good_fit": return "text-[#2450d6]";
    case "stretch": return "text-[#b25e09]";
    case "not_recommended": return "text-[#ef4444]";
    default: return "text-foreground";
  }
}
