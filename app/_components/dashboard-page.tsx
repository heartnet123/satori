import { useState, type CSSProperties } from "react";
import {
  ClockIcon,
  GraduationIcon,
  MapPinIcon,
  SearchDocumentIcon,
  UploadIcon,
} from "./icons";
import { Topbar } from "./topbar";

type FileRow = {
  name: string;
  size: string;
  date: string;
  status: string;
};

type ChipTone =
  | "blue"
  | "cyan"
  | "teal"
  | "violet"
  | "amber"
  | "emerald"
  | "indigo"
  | "pink"
  | "sky"
  | "slate";

const files: FileRow[] = [
  { name: "john_doe_resume.pdf", size: "2.1 MB", date: "May 31, 2024", status: "Parsed" },
  { name: "sarah_lee_resume.pdf", size: "3.8 MB", date: "May 30, 2024", status: "Parsed" },
  { name: "michael_chen_resume.pdf", size: "2.4 MB", date: "May 28, 2024", status: "Parsed" },
  { name: "anita_sharma_resume.pdf", size: "1.9 MB", date: "May 8, 2024", status: "Parsed" },
];

const skills: Array<{ label: string; tone: ChipTone }> = [
  { label: "Python", tone: "blue" },
  { label: "React", tone: "indigo" },
  { label: "NLP", tone: "violet" },
  { label: "SQL", tone: "emerald" },
  { label: "AWS", tone: "amber" },
  { label: "Data Analysis", tone: "cyan" },
  { label: "Machine Learning", tone: "pink" },
  { label: "Pandas", tone: "sky" },
  { label: "TensorFlow", tone: "teal" },
  { label: "Docker", tone: "slate" },
];

const experience = [
  {
    role: "Senior Data Scientist",
    company: "TechNova Solutions",
    dates: "2021 – Present (2.8 yrs)",
    location: "Bangalore, India",
    tone: "blue",
  },
  {
    role: "Data Scientist",
    company: "InnoData Labs",
    dates: "2019 – 2021 (2.1 yrs)",
    location: "Bangalore, India",
    tone: "violet",
  },
  {
    role: "ML Engineer",
    company: "AnalyticsWorks",
    dates: "2017 – 2019 (2.0 yrs)",
    location: "Pune, India",
    tone: "emerald",
  },
] as const;

const experienceDotColors: Record<(typeof experience)[number]["tone"], string> = {
  blue: "#2d63f3",
  violet: "#8b5cf6",
  emerald: "#0f9b8e",
};

type CSSVariableStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

const chipStyles: Record<ChipTone, CSSVariableStyle> = {
  blue: {
    "--chip-bg": "rgba(45, 99, 243, 0.08)",
    "--chip-border": "rgba(45, 99, 243, 0.2)",
    "--chip-text": "#2450d6",
  },
  indigo: {
    "--chip-bg": "rgba(79, 70, 229, 0.08)",
    "--chip-border": "rgba(79, 70, 229, 0.2)",
    "--chip-text": "#4f46e5",
  },
  violet: {
    "--chip-bg": "rgba(139, 92, 246, 0.08)",
    "--chip-border": "rgba(139, 92, 246, 0.2)",
    "--chip-text": "#7c3aed",
  },
  emerald: {
    "--chip-bg": "rgba(16, 185, 129, 0.08)",
    "--chip-border": "rgba(16, 185, 129, 0.2)",
    "--chip-text": "#059669",
  },
  amber: {
    "--chip-bg": "rgba(245, 158, 11, 0.1)",
    "--chip-border": "rgba(245, 158, 11, 0.22)",
    "--chip-text": "#d97706",
  },
  cyan: {
    "--chip-bg": "rgba(34, 211, 238, 0.1)",
    "--chip-border": "rgba(34, 211, 238, 0.22)",
    "--chip-text": "#0e7490",
  },
  teal: {
    "--chip-bg": "rgba(20, 184, 166, 0.08)",
    "--chip-border": "rgba(20, 184, 166, 0.2)",
    "--chip-text": "#0f766e",
  },
  pink: {
    "--chip-bg": "rgba(236, 72, 153, 0.08)",
    "--chip-border": "rgba(236, 72, 153, 0.2)",
    "--chip-text": "#db2777",
  },
  sky: {
    "--chip-bg": "rgba(14, 165, 233, 0.08)",
    "--chip-border": "rgba(14, 165, 233, 0.2)",
    "--chip-text": "#0369a1",
  },
  slate: {
    "--chip-bg": "rgba(100, 116, 139, 0.08)",
    "--chip-border": "rgba(100, 116, 139, 0.2)",
    "--chip-text": "#475569",
  },
};

import { JobsListing } from "./jobs-listing";
import { JobCreationForm } from "./job-creation-form";
// ... (rest of imports)

export function DashboardPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="flex min-h-full flex-col">
      <Topbar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
          <section className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Dashboard
            </h1>
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="flex flex-col gap-6">
              <JobCreationForm onJobCreated={() => setRefresh(prev => prev + 1)} />
              <JobsListing />
              <IngestionZoneCard />
              <RecentFilesCard />
            </div>

            <ProfileCard />
          </div>
        </div>
      </main>
    </div>
  );
}

function IngestionZoneCard() {
  return (
    <section className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_20px_50px_rgba(18,38,79,0.06)]">
      <header className="border-b border-line px-6 py-5">
        <h2 className="text-lg font-semibold text-foreground">Ingestion Zone</h2>
      </header>

      <div className="p-6">
        <div className="flex min-h-[305px] items-center justify-center rounded-[22px] border-2 border-dashed border-[#dbe3f1] bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(255,255,255,0.95))] px-6 py-10">
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadIcon className="h-7 w-7" />
            </div>
            <p className="text-lg text-muted-foreground">
              Drag & drop PDF resumes here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">or</p>
            <button
              type="button"
              className="mt-5 inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_16px_36px_rgba(45,99,243,0.28)] transition hover:-translate-y-0.5 hover:bg-primary/95 focus:outline-none focus:ring-4 focus:ring-primary/15"
            >
              <UploadIcon className="h-4 w-4" />
              Upload PDF
            </button>
            <p className="mt-4 text-sm text-muted-foreground">Max file size 20MB</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentFilesCard() {
  return (
    <section className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_20px_50px_rgba(18,38,79,0.06)]">
      <header className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="text-lg font-semibold text-foreground">Recent Files</h2>
        <button
          type="button"
          className="text-sm font-medium text-primary transition hover:text-primary/80"
        >
          View all
        </button>
      </header>

      <div className="divide-y divide-line">
        {files.map((file) => (
          <article
            key={file.name}
            className="flex items-center justify-between gap-4 px-6 py-5"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1f1] text-[#ef4444]">
                <SearchDocumentIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-foreground">
                  {file.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {file.size} · {file.date}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#eaf9ee] px-3 py-1 text-xs font-semibold text-[#13803c]">
              {file.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileCard() {
  return (
    <section className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_20px_50px_rgba(18,38,79,0.06)]">
      <header className="border-b border-line px-6 py-5">
        <h2 className="text-lg font-semibold text-foreground">
          Extracted Profile View
        </h2>
      </header>

      <div className="space-y-6 px-6 py-6">
        <div className="flex items-start gap-5">
          <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground shadow-[0_18px_40px_rgba(45,99,243,0.24)]">
            JD
          </div>

          <div className="min-w-0">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              John Doe
            </h3>
            <p className="text-lg text-muted-foreground">
              Senior Data Scientist
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4" />
                Bangalore, India
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                7.2 Years Experience
              </span>
            </div>
          </div>
        </div>

        <section>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Skills Vector (Normalized)
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.label}
                className="rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur [background-color:var(--chip-bg)] [border-color:var(--chip-border)] [color:var(--chip-text)]"
                style={chipStyles[skill.tone]}
              >
                {skill.label}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Experience Timeline
          </h4>

          <div className="mt-4 space-y-5">
            {experience.map((item, index) => (
              <div key={item.role} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className="mt-1.5 h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: experienceDotColors[item.tone] }}
                  />
                  {index !== experience.length - 1 ? (
                    <span className="mt-1 h-full w-px flex-1 bg-line" />
                  ) : null}
                </div>

                <div className="pb-1">
                  <h5 className="text-base font-semibold text-foreground">
                    {item.role}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {item.company} · {item.dates}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Education Entity
          </h4>

          <div className="mt-4 flex items-start gap-4 rounded-2xl border border-line bg-surface-muted/70 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationIcon className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-base font-semibold text-foreground">
                Master of Technology in Computer Science
              </h5>
              <p className="text-sm text-muted-foreground">
                Indian Institute of Technology, Delhi
              </p>
              <p className="text-sm text-muted-foreground">
                2015 – 2017 · CGPA: 8.6 / 10
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
