import {
  analyzedJobSchema,
  opportunityRecommendationSchema,
  recruitmentMatchSchema,
  type AnalyzedJob,
  type JobInput,
  type OpportunityRecommendation,
  type RecruitmentMatch,
  type Seniority,
  type ResumeExtraction,
} from "./types";

const SKILL_TAXONOMY = [
  { name: "Next.js", aliases: ["nextjs", "next js"] },
  { name: "React", aliases: ["reactjs", "react js"] },
  { name: "TypeScript", aliases: ["typescript", "ts"] },
  { name: "JavaScript", aliases: ["javascript", "js", "node.js", "nodejs"] },
  { name: "Python", aliases: ["python"] },
  { name: "Django", aliases: ["django"] },
  { name: "PostgreSQL", aliases: ["postgresql", "postgres", "pgsql"] },
  { name: "SQL", aliases: ["sql", "sqlite", "mysql"] },
  { name: "Docker", aliases: ["docker", "container"] },
  { name: "AWS", aliases: ["aws", "amazon web services"] },
  { name: "Machine Learning", aliases: ["machine learning", "ml"] },
  { name: "NLP", aliases: ["nlp", "natural language processing"] },
  { name: "Tailwind CSS", aliases: ["tailwind", "tailwind css"] },
  { name: "Svelte", aliases: ["svelte", "sveltekit"] },
  { name: "Linux", aliases: ["linux"] },
];

const DOMAIN_TAXONOMY = [
  "E-commerce",
  "E-book Platform",
  "Ticket Booking",
  "Inventory Management",
  "Recruitment",
  "AI",
  "Game Development",
  "Cybersecurity",
];

const SENIORITY_RANK: Record<Seniority, number> = {
  intern: 0,
  junior: 1,
  mid: 2,
  senior: 3,
  lead: 4,
  unspecified: 1,
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractKnownSkills(text: string): string[] {
  const normalized = normalizeText(text);

  return SKILL_TAXONOMY.filter((skill) =>
    [skill.name, ...skill.aliases].some((alias) => containsTerm(normalized, alias))
  ).map((skill) => skill.name);
}

export function inferSeniority(text: string): Seniority {
  const normalized = normalizeText(text);

  if (containsTerm(normalized, "lead") || containsTerm(normalized, "principal")) return "lead";
  if (containsTerm(normalized, "senior") || containsTerm(normalized, "sr")) return "senior";
  if (containsTerm(normalized, "mid") || containsTerm(normalized, "middle")) return "mid";
  if (containsTerm(normalized, "junior") || containsTerm(normalized, "jr") || containsTerm(normalized, "entry")) return "junior";
  if (containsTerm(normalized, "intern") || containsTerm(normalized, "internship") || containsTerm(normalized, "student")) return "intern";

  return "unspecified";
}

export function analyzeJob(
  input: JobInput,
  options: { id?: string; createdAt?: string; updatedAt?: string } = {}
): AnalyzedJob {
  const now = new Date().toISOString();
  const text = `${input.title} ${input.company ?? ""} ${input.location ?? ""} ${input.description}`;
  const extractedSkills = extractKnownSkills(text);
  const domains = extractDomains(text);
  const responsibilities = extractLines(input.description, ["build", "develop", "own", "deliver", "collaborate", "design"]);
  const requirements = extractLines(input.description, ["experience", "required", "must", "skill", "using", "with", "knowledge"]);
  const confidence = Math.min(0.95, 0.55 + extractedSkills.length * 0.05 + requirements.length * 0.03);

  return analyzedJobSchema.parse({
    id: options.id ?? "job_preview",
    title: input.title.trim(),
    company: input.company?.trim() || null,
    location: input.location?.trim() || null,
    description: input.description.trim(),
    extractedSkills,
    seniority: inferSeniority(text),
    responsibilities: responsibilities.length > 0 ? responsibilities : ["Review role description and collaborate across the delivery team."],
    requirements: requirements.length > 0 ? requirements : extractedSkills.map((skill) => `Hands-on ${skill} experience.`),
    domains,
    confidence: Number(confidence.toFixed(2)),
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
  });
}

export function scoreResumeForJob(
  resume: ResumeExtraction,
  analyzedJob: AnalyzedJob,
  options: { resumeId?: string; matchId?: string } = {}
): RecruitmentMatch {
  const candidateSkills = collectResumeSkills(resume);
  const jobSkills = analyzedJob.extractedSkills;
  const matchedSkills = jobSkills.filter((skill) => hasSkill(candidateSkills, skill));
  const missingSkills = jobSkills.filter((skill) => !hasSkill(candidateSkills, skill));
  const skillScore = jobSkills.length === 0 ? 55 : (matchedSkills.length / jobSkills.length) * 100;
  const seniorityScore = getSeniorityFit(resume, analyzedJob.seniority);
  const domainScore = getDomainFit(resume, analyzedJob);
  const score = clamp(Math.round(skillScore * 0.7 + seniorityScore * 0.15 + domainScore * 0.15), 0, 100);
  const strengths = buildStrengths(resume, matchedSkills, domainScore);
  const risks = buildRisks(resume, missingSkills, analyzedJob.seniority, seniorityScore);
  const label = getRecommendationLabel(score);
  const candidateName = resume.fullName;
  const skillSummary = matchedSkills.length > 0 ? matchedSkills.join(", ") : "no direct taxonomy skill matches";
  const gapSummary = missingSkills.length > 0 ? missingSkills.join(", ") : "no major skill gaps from the supplied description";

  return recruitmentMatchSchema.parse({
    id: options.matchId ?? `match_${analyzedJob.id}_${slugify(candidateName)}`,
    resumeId: options.resumeId ?? slugify(candidateName),
    candidateName,
    jobId: analyzedJob.id,
    score,
    matchedSkills,
    missingSkills,
    strengths,
    risks,
    explanation: `${candidateName} matches ${analyzedJob.title} on ${skillSummary}. Remaining gaps: ${gapSummary}.`,
    recommendationLabel: label,
    createdAt: new Date().toISOString(),
  });
}

export function recommendOpportunities(matches: RecruitmentMatch[]): OpportunityRecommendation[] {
  return matches
    .filter((match) => match.score >= 45)
    .sort((a, b) => b.score - a.score)
    .map((match, index) =>
      opportunityRecommendationSchema.parse({
        id: `rec_${match.id}`,
        jobId: match.jobId,
        matchId: match.id,
        title: `${index + 1}. ${match.candidateName} for ${humanizeLabel(match.recommendationLabel)}`,
        score: match.score,
        reason: match.explanation,
        nextAction: match.score >= 75 ? "Invite candidate to a focused technical screen." : "Review skill gaps before outreach.",
      })
    );
}

function containsTerm(normalizedText: string, term: string): boolean {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm) return false;
  const compactText = normalizedText.replace(/[^a-z0-9]/g, "");
  const compactTerm = normalizedTerm.replace(/[^a-z0-9]/g, "");
  if (compactTerm.length > 2 && compactText.includes(compactTerm)) return true;

  return new RegExp(`(^|[^a-z0-9+#.])${escapeRegExp(normalizedTerm)}($|[^a-z0-9+#.])`).test(
    normalizedText
  );
}

function collectResumeSkills(resume: ResumeExtraction): string[] {
  const values = [
    ...resume.skills,
    resume.summary,
  ];

  return Array.from(new Set(values.flatMap(extractKnownSkills)));
}

function hasSkill(candidateSkills: string[], skill: string): boolean {
  return candidateSkills.some((candidateSkill) => normalizeText(candidateSkill) === normalizeText(skill));
}

function extractDomains(text: string): string[] {
  const normalized = normalizeText(text);
  return DOMAIN_TAXONOMY.filter((domain) => containsTerm(normalized, domain));
}

function extractLines(description: string, keywords: string[]): string[] {
  const segments = description
    .split(/[\n.;]/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 12);
  const matches = segments.filter((line) => keywords.some((keyword) => normalizeText(line).includes(keyword)));

  return Array.from(new Set(matches)).slice(0, 5);
}

function getSeniorityFit(resume: ResumeExtraction, jobSeniority: Seniority): number {
  if (jobSeniority === "unspecified") return 75;

  const resumeSeniority = normalizeText(resume.title);
  const candidateSeniority: Seniority = resumeSeniority.includes("student")
    ? "intern"
    : resumeSeniority.includes("junior")
    ? "junior"
    : resumeSeniority.includes("mid")
    ? "mid"
    : resumeSeniority.includes("senior")
    ? "senior"
    : "unspecified";
  const distance = Math.abs(SENIORITY_RANK[jobSeniority] - SENIORITY_RANK[candidateSeniority]);

  if (distance === 0) return 100;
  if (distance === 1) return 70;
  if (distance === 2) return 40;
  return 20;
}

function getDomainFit(resume: ResumeExtraction, analyzedJob: AnalyzedJob): number {
  const resumeText = [
    ...resume.skills,
    resume.summary,
  ].join(" ");
  const resumeDomains = extractDomains(resumeText);
  const domainMatches = analyzedJob.domains.filter((domain) => resumeDomains.includes(domain));
  const toolMatches = analyzedJob.extractedSkills.filter((skill) =>
    resume.skills.some((s) => normalizeText(s) === normalizeText(skill))
  );

  if (analyzedJob.domains.length === 0 && toolMatches.length === 0) return 60;

  const domainPart = analyzedJob.domains.length === 0 ? 50 : (domainMatches.length / analyzedJob.domains.length) * 100;
  const toolPart = analyzedJob.extractedSkills.length === 0 ? 50 : (toolMatches.length / analyzedJob.extractedSkills.length) * 100;

  return Math.round(domainPart * 0.6 + toolPart * 0.4);
}

function buildStrengths(resume: ResumeExtraction, matchedSkills: string[], domainScore: number): string[] {
  const strengths = [];
  if (matchedSkills.length > 0) strengths.push(`Direct skill overlap: ${matchedSkills.join(", ")}.`);
  if (domainScore >= 60) strengths.push("Domain or tool context overlaps with the job description.");
  if (strengths.length === 0) strengths.push("Candidate has a usable parsed profile for recruiter review.");
  return strengths;
}

function buildRisks(
  resume: ResumeExtraction,
  missingSkills: string[],
  jobSeniority: Seniority,
  seniorityScore: number
): string[] {
  const risks = [];
  if (missingSkills.length > 0) risks.push(`Missing requested skills: ${missingSkills.join(", ")}.`);
  if (seniorityScore < 70) risks.push(`Parsed seniority may not align with a ${jobSeniority} role.`);
  return risks;
}

function getRecommendationLabel(score: number): RecruitmentMatch["recommendationLabel"] {
  if (score >= 80) return "strong_fit";
  if (score >= 65) return "good_fit";
  if (score >= 45) return "stretch";
  return "not_recommended";
}

function humanizeLabel(label: RecruitmentMatch["recommendationLabel"]): string {
  return label.replace(/_/g, " ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function slugify(value: string): string {
  return normalizeText(value).replace(/\s+/g, "-") || "candidate";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
