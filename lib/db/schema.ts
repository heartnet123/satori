type ColumnDescriptor = {
  name: string;
  type: "uuid" | "text" | "text[]" | "timestamp" | "vector";
  nullable?: boolean;
  dimensions?: number;
};

type TableDescriptor = {
  name: string;
  columns: Record<string, ColumnDescriptor>;
};

function table(name: string, columns: TableDescriptor["columns"]): TableDescriptor {
  return { name, columns };
}

export const documents = table("documents", {
  id: { name: "id", type: "uuid" },
  name: { name: "name", type: "text" },
  content: { name: "content", type: "text", nullable: true },
  embedding: { name: "embedding", type: "vector", dimensions: 1536, nullable: true },
  createdAt: { name: "created_at", type: "timestamp" },
});

export const resumeExtractions = table("resume_extractions", {
  id: { name: "id", type: "uuid" },
  fullName: { name: "full_name", type: "text" },
  title: { name: "title", type: "text" },
  email: { name: "email", type: "text", nullable: true },
  phone: { name: "phone", type: "text", nullable: true },
  location: { name: "location", type: "text", nullable: true },
  summary: { name: "summary", type: "text" },
  skills: { name: "skills", type: "text[]" },
  sourceFileName: { name: "source_file_name", type: "text" },
  createdAt: { name: "created_at", type: "timestamp" },
});

export const jobs = table("jobs", {
  id: { name: "id", type: "uuid" },
  title: { name: "title", type: "text" },
  description: { name: "description", type: "text" },
  requirements: { name: "requirements", type: "text[]" },
  createdAt: { name: "created_at", type: "timestamp" },
});

export const matches = table("matches", {
  id: { name: "id", type: "uuid" },
  jobId: { name: "job_id", type: "uuid" },
  resumeId: { name: "resume_id", type: "uuid" },
  score: { name: "score", type: "text" }, // Stored as text for now
  rationale: { name: "rationale", type: "text" },
  createdAt: { name: "created_at", type: "timestamp" },
});
