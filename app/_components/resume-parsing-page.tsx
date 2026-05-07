"use client";

import { useEffect, useMemo, useState } from "react";
import type { ParsedResume } from "@/lib/resume-processing";
import type {
  AnalyzedJob,
  OpportunityRecommendation,
  RecruitmentMatch,
} from "@/lib/recruitment/types";
import { BriefcaseIcon, ClockIcon, StarIcon, UploadIcon } from "./icons";

type ResumeUploadResponse = {
  resumeId: string;
  candidateId: string;
  status: "UPLOADED";
  message: string;
};

type ResumeStatusResponse = {
  resumeId: string;
  status:
    | "UPLOADED"
    | "EXTRACTING_TEXT"
    | "CLEANING_TEXT"
    | "PARSING_AI"
    | "VALIDATING_SCHEMA"
    | "NORMALIZING"
    | "EMBEDDING"
    | "MATCHING"
    | "READY"
    | "FAILED_EXTRACTION"
    | "FAILED_AI_PARSE"
    | "FAILED_VALIDATION"
    | "FAILED_EMBEDDING"
    | "FAILED_MATCHING";
  progress: number;
  currentStep: string;
  error: null | { errorCode: string; message: string; canRetry: boolean };
  parsedJson?: ParsedResume | null;
  cleanMarkdown?: string | null;
};

type JobForm = {
  title: string;
  company: string;
  location: string;
  description: string;
};

const stepOrder = [
  { key: "EXTRACTING_TEXT", label: "Extracting text" },
  { key: "CLEANING_TEXT", label: "Cleaning text" },
  { key: "PARSING_AI", label: "Parsing profile" },
  { key: "VALIDATING_SCHEMA", label: "Validating schema" },
  { key: "NORMALIZING", label: "Normalizing skills" },
  { key: "EMBEDDING", label: "Creating embedding" },
  { key: "MATCHING", label: "Running matching" },
] as const;

const initialStatus = {
  resumeId: "",
  status: "UPLOADED" as const,
  progress: 0,
  currentStep: "Resume uploaded",
  error: null,
};

const emptyJobForm: JobForm = {
  title: "Junior Fullstack Developer",
  company: "Satori Demo Co.",
  location: "Remote / Bangkok",
  description:
    "Junior Fullstack Developer using Next.js, React, TypeScript, Python, Django, PostgreSQL, and Docker. Build customer-facing web applications, collaborate with product teams, and support e-commerce workflows.",
};

export function ResumeParsingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadState, setUploadState] = useState<ResumeUploadResponse | null>(null);
  const [statusState, setStatusState] = useState<ResumeStatusResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<AnalyzedJob[]>([]);
  const [currentJob, setCurrentJob] = useState<AnalyzedJob | null>(null);
  const [jobForm, setJobForm] = useState<JobForm>(emptyJobForm);
  const [analyzingJob, setAnalyzingJob] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  const [matches, setMatches] = useState<RecruitmentMatch[]>([]);
  const [recommendations, setRecommendations] = useState<OpportunityRecommendation[]>([]);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const activeResumeId = uploadState?.resumeId ?? "";

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      const response = await fetch("/api/jobs");
      const data = (await response.json()) as { items?: AnalyzedJob[]; error?: string };
      if (cancelled) return;

      if (!response.ok) {
        setJobError(data.error ?? "Could not load demo jobs.");
        return;
      }

      const loadedJobs = data.items ?? [];
      setJobs(loadedJobs);
      if (loadedJobs[0]) {
        setCurrentJob(loadedJobs[0]);
        setJobForm(jobToForm(loadedJobs[0]));
      }
    }

    void loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeResumeId) return;

    let cancelled = false;

    const sync = async () => {
      const response = await fetch(`/api/resumes/upload?resumeId=${activeResumeId}`);
      if (!response.ok) return;
      const data = (await response.json()) as ResumeStatusResponse;
      if (!cancelled) setStatusState(data);
    };

    void sync();
    const timer = setInterval(() => {
      void sync();
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [activeResumeId]);

  const completedSteps = useMemo(() => {
    if (statusState?.status === "READY") return stepOrder;
    const currentIndex = stepOrder.findIndex((step) => step.key === statusState?.status);
    return currentIndex === -1 ? [] : stepOrder.slice(0, currentIndex);
  }, [statusState?.status]);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError(null);

    if (!file) {
      setUploadError("Please choose a PDF or DOCX resume first.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }

      setUploadState(data as ResumeUploadResponse);
      setStatusState({
        ...initialStatus,
        resumeId: data.resumeId,
        currentStep: data.message,
      });
    } catch {
      setUploadError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAnalyzeJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJobError(null);
    setMatchError(null);
    setAnalyzingJob(true);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jobForm.title,
          company: jobForm.company || undefined,
          location: jobForm.location || undefined,
          description: jobForm.description,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setJobError(data.error ?? "Job analysis failed.");
        return;
      }

      const job = data as AnalyzedJob;
      setCurrentJob(job);
      setJobs((items) => [job, ...items.filter((item) => item.id !== job.id)]);
      setMatches([]);
      setRecommendations([]);
    } catch {
      setJobError("Job analysis failed.");
    } finally {
      setAnalyzingJob(false);
    }
  }

  async function handleRunMatching() {
    setMatchError(null);

    if (!currentJob) {
      setMatchError("Analyze or select a job before running matching.");
      return;
    }

    setMatching(true);

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: currentJob.id }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMatchError(data.error ?? "Matching failed.");
        return;
      }

      setMatches(data.items ?? []);
      setRecommendations(data.recommendations ?? []);
    } catch {
      setMatchError("Matching failed.");
    } finally {
      setMatching(false);
    }
  }

  function handleSelectJob(jobId: string) {
    const job = jobs.find((item) => item.id === jobId) ?? null;
    setCurrentJob(job);
    if (job) setJobForm(jobToForm(job));
    setMatches([]);
    setRecommendations([]);
    setMatchError(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-line bg-surface p-6 shadow-[0_24px_70px_rgba(18,38,79,0.08)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                MVP recruitment workspace
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Resume to role fit, in one deterministic demo flow.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                Upload a resume, analyze a job description, run transparent heuristic matching,
                and review recruiter-ready recommendations without adding external AI services.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-line bg-surface-muted px-4 py-3 text-sm text-muted-foreground">
              <ClockIcon className="h-4 w-4" />
              Resume polling every 2s
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <UploadCard
            file={file}
            uploading={uploading}
            onChangeFile={setFile}
            onSubmit={handleUpload}
            error={uploadError}
          />

          <StatusCard
            uploadState={uploadState}
            statusState={statusState}
            completedSteps={completedSteps}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <JobAnalyzerPanel
            jobs={jobs}
            currentJob={currentJob}
            jobForm={jobForm}
            analyzing={analyzingJob}
            error={jobError}
            onChangeForm={setJobForm}
            onSelectJob={handleSelectJob}
            onSubmit={handleAnalyzeJob}
          />

          <MatchResultsPanel
            currentJob={currentJob}
            matches={matches}
            matching={matching}
            error={matchError}
            onRunMatching={handleRunMatching}
          />
        </section>

        <RecommendationsPanel recommendations={recommendations} />
      </main>
    </div>
  );
}

function UploadCard({
  file,
  uploading,
  onChangeFile,
  onSubmit,
  error,
}: {
  file: File | null;
  uploading: boolean;
  onChangeFile: (file: File | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  error: string | null;
}) {
  return (
    <section className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_24px_70px_rgba(18,38,79,0.08)]">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Step 1</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
          Resume parsing pipeline
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Upload once, then let the pipeline extract, normalize, and add the candidate to the demo matching pool.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-line bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,0.96))] px-6 py-10 text-center transition hover:border-primary/40 hover:bg-white">
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(event) => onChangeFile(event.target.files?.[0] ?? null)}
          />
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadIcon className="h-7 w-7" />
          </div>
          <p className="text-lg font-medium text-foreground">
            {file ? file.name : "Drop resume here or click to select"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">PDF and DOCX supported · Max 20MB</p>
          <button
            type="button"
            className="mt-5 rounded-full border border-line px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-surface-muted"
            onClick={() => onChangeFile(null)}
          >
            Clear file
          </button>
        </label>

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <button
          type="submit"
          disabled={uploading}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_rgba(45,99,243,0.24)] transition hover:-translate-y-0.5 hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploading ? "Uploading..." : "Upload resume and start parsing"}
        </button>
      </form>
    </section>
  );
}

function StatusCard({
  uploadState,
  statusState,
  completedSteps,
}: {
  uploadState: ResumeUploadResponse | null;
  statusState: ResumeStatusResponse | null;
  completedSteps: readonly (typeof stepOrder)[number][];
}) {
  return (
    <section className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_24px_70px_rgba(18,38,79,0.08)]">
      <h2 className="font-display text-2xl font-semibold text-foreground">Processing status</h2>

      {!uploadState ? (
        <div className="mt-6 rounded-[22px] border border-line bg-surface-muted/70 p-5 text-sm text-muted-foreground">
          Upload a resume to see progress and parsed output. A seeded demo candidate is already available for matching.
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-[22px] border border-line bg-surface-muted/70 p-5">
            <p className="text-sm text-muted-foreground">Resume uploaded</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{uploadState.resumeId}</p>
            <p className="mt-1 text-sm text-muted-foreground">{uploadState.message}</p>
          </div>

          <div className="mt-5 space-y-4">
            {stepOrder.map((step) => {
              const active = statusState?.status === step.key;
              const done = completedSteps.some((completed) => completed.key === step.key);

              return (
                <div key={step.key} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      done
                        ? "bg-emerald-500 text-white"
                        : active
                        ? "bg-primary text-white"
                        : "bg-surface-muted text-muted-foreground"
                    }`}
                  >
                    {done ? "✓" : active ? "•" : ""}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{step.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {done ? "Completed" : active ? "In progress" : "Waiting"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-[22px] border border-line bg-surface-muted/70 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current step</p>
                <p className="text-base font-semibold text-foreground">
                  {statusState?.currentStep ?? "Queued"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-base font-semibold text-foreground">{statusState?.progress ?? 0}%</p>
              </div>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${statusState?.progress ?? 0}%` }}
              />
            </div>
          </div>

          {statusState?.status === "READY" && statusState.parsedJson ? (
            <ParsedPreview parsedJson={statusState.parsedJson} cleanMarkdown={statusState.cleanMarkdown ?? ""} />
          ) : null}

          {statusState?.error ? (
            <div className="mt-5 rounded-[22px] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              <p className="font-semibold">{statusState.error.errorCode}</p>
              <p className="mt-1">{statusState.error.message}</p>
              <p className="mt-1 text-xs uppercase tracking-wide">
                Can retry: {statusState.error.canRetry ? "Yes" : "No"}
              </p>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function JobAnalyzerPanel({
  jobs,
  currentJob,
  jobForm,
  analyzing,
  error,
  onChangeForm,
  onSelectJob,
  onSubmit,
}: {
  jobs: AnalyzedJob[];
  currentJob: AnalyzedJob | null;
  jobForm: JobForm;
  analyzing: boolean;
  error: string | null;
  onChangeForm: (form: JobForm) => void;
  onSelectJob: (jobId: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <section className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_24px_70px_rgba(18,38,79,0.08)]">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseIcon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Step 2</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">Job description analyzer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create or select a demo role and extract skills, seniority, responsibilities, and requirements.
          </p>
        </div>
      </div>

      {jobs.length > 0 ? (
        <label className="mb-5 block text-sm font-medium text-foreground">
          Demo jobs
          <select
            value={currentJob?.id ?? ""}
            onChange={(event) => onSelectJob(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} {job.company ? `· ${job.company}` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Title"
            value={jobForm.title}
            onChange={(value) => onChangeForm({ ...jobForm, title: value })}
          />
          <TextField
            label="Company"
            value={jobForm.company}
            onChange={(value) => onChangeForm({ ...jobForm, company: value })}
          />
        </div>
        <TextField
          label="Location"
          value={jobForm.location}
          onChange={(value) => onChangeForm({ ...jobForm, location: value })}
        />
        <label className="block text-sm font-medium text-foreground">
          Job description
          <textarea
            value={jobForm.description}
            onChange={(event) => onChangeForm({ ...jobForm, description: event.target.value })}
            rows={7}
            className="mt-2 w-full resize-y rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary"
          />
        </label>

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <button
          type="submit"
          disabled={analyzing}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_rgba(45,99,243,0.24)] transition hover:-translate-y-0.5 hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {analyzing ? "Analyzing..." : "Analyze job description"}
        </button>
      </form>

      {currentJob ? <JobAnalysisSummary job={currentJob} /> : null}
    </section>
  );
}

function MatchResultsPanel({
  currentJob,
  matches,
  matching,
  error,
  onRunMatching,
}: {
  currentJob: AnalyzedJob | null;
  matches: RecruitmentMatch[];
  matching: boolean;
  error: string | null;
  onRunMatching: () => Promise<void>;
}) {
  return (
    <section className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_24px_70px_rgba(18,38,79,0.08)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Step 3</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">Candidate-role matching</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Match parsed candidates to the selected role with visible skill gaps and recruiter notes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void onRunMatching()}
          disabled={matching || !currentJob}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-foreground px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {matching ? "Matching..." : "Run matching"}
        </button>
      </div>

      {currentJob ? (
        <div className="rounded-[22px] border border-line bg-surface-muted/70 p-5">
          <p className="text-sm text-muted-foreground">Selected role</p>
          <p className="mt-1 font-display text-xl font-semibold text-foreground">{currentJob.title}</p>
          <BadgeList values={currentJob.extractedSkills} emptyLabel="No extracted skills yet" />
        </div>
      ) : (
        <div className="rounded-[22px] border border-line bg-surface-muted/70 p-5 text-sm text-muted-foreground">
          Analyze a job description before running matching.
        </div>
      )}

      {error ? <div className="mt-5"><ErrorMessage>{error}</ErrorMessage></div> : null}

      <div className="mt-5 space-y-4">
        {matches.length === 0 ? (
          <div className="rounded-[22px] border border-line bg-white p-5 text-sm text-muted-foreground">
            Matching results will appear here after you run the engine.
          </div>
        ) : (
          matches.map((match) => <MatchCard key={match.id} match={match} />)
        )}
      </div>
    </section>
  );
}

function RecommendationsPanel({ recommendations }: { recommendations: OpportunityRecommendation[] }) {
  return (
    <section className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_24px_70px_rgba(18,38,79,0.08)]">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <StarIcon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Step 4</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">Opportunity recommendations</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ranked follow-up cards based on the latest match run. This demo uses deterministic scoring, not live LLM calls.
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-[22px] border border-line bg-surface-muted/70 p-5 text-sm text-muted-foreground">
          Run matching to generate recruiter next actions.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {recommendations.map((recommendation) => (
            <article key={recommendation.id} className="rounded-[22px] border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-foreground">{recommendation.title}</h3>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {recommendation.score}%
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{recommendation.reason}</p>
              <p className="mt-4 rounded-2xl bg-surface-muted px-4 py-3 text-sm font-medium text-foreground">
                {recommendation.nextAction}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ParsedPreview({ parsedJson, cleanMarkdown }: { parsedJson: ParsedResume; cleanMarkdown: string }) {
  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-[22px] border border-line bg-white p-5">
        <h3 className="text-base font-semibold text-foreground">Candidate profile</h3>
        <p className="mt-1 text-sm text-muted-foreground">{parsedJson.headline}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoRow label="Name" value={parsedJson.candidate.fullName} />
          <InfoRow label="Location" value={parsedJson.candidate.location ?? "Not listed"} />
          <InfoRow label="Experience" value={`${parsedJson.inferredProfile.totalYearsExperience} years`} />
          <InfoRow label="Skills" value={`${parsedJson.skills.primary.length} primary skills`} />
        </div>
      </div>

      <div className="rounded-[22px] border border-line bg-white p-5">
        <h3 className="text-base font-semibold text-foreground">Clean markdown preview</h3>
        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl bg-surface-muted p-4 text-xs leading-6 text-muted-foreground">
          {cleanMarkdown}
        </pre>
      </div>
    </div>
  );
}

function JobAnalysisSummary({ job }: { job: AnalyzedJob }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-[22px] border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Analyzed role</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-foreground">{job.title}</h3>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {Math.round(job.confidence * 100)}% confidence
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoRow label="Seniority" value={job.seniority} />
          <InfoRow label="Requirements" value={`${job.requirements.length} extracted`} />
        </div>
        <BadgeList values={job.extractedSkills} emptyLabel="No skills extracted" />
      </div>
      <div className="rounded-[22px] border border-line bg-surface-muted/70 p-5">
        <h4 className="text-sm font-semibold text-foreground">Requirements</h4>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
          {job.requirements.map((requirement) => (
            <li key={requirement}>• {requirement}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: RecruitmentMatch }) {
  return (
    <article className="rounded-[22px] border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">{match.candidateName}</h3>
          <p className="mt-1 text-sm capitalize text-muted-foreground">
            {match.recommendationLabel.replace(/_/g, " ")}
          </p>
        </div>
        <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {match.score}% fit
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{match.explanation}</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Matched skills</h4>
          <BadgeList values={match.matchedSkills} emptyLabel="No direct matches" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Missing skills</h4>
          <BadgeList values={match.missingSkills} emptyLabel="No major gaps" tone="muted" />
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Strengths" items={match.strengths} />
        <ListBlock title="Risks" items={match.risks} />
      </div>
    </article>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-medium text-foreground">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
      />
    </label>
  );
}

function BadgeList({
  values,
  emptyLabel,
  tone = "primary",
}: {
  values: string[];
  emptyLabel: string;
  tone?: "primary" | "muted";
}) {
  if (values.length === 0) {
    return <p className="mt-3 text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            tone === "primary" ? "bg-primary/10 text-primary" : "bg-surface-muted text-muted-foreground"
          }`}
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-surface-muted/80 p-4">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-muted/80 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function jobToForm(job: AnalyzedJob): JobForm {
  return {
    title: job.title,
    company: job.company ?? "",
    location: job.location ?? "",
    description: job.description,
  };
}
