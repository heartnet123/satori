"use client";

import { useState } from "react";
import { createJob } from "@/lib/recruitment/store";

export function JobCreationForm({ onJobCreated }: { onJobCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
        setError("Title and Description are required.");
        return;
    }
    setError("");
    try {
        await createJob({
          title,
          description,
          requirements: requirements.split(",").filter(s => s.trim()).map((s) => s.trim()),
        });
        onJobCreated();
        setTitle("");
        setDescription("");
        setRequirements("");
    } catch (err) {
        setError("Failed to create job.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[22px] border border-line bg-surface p-6 shadow-[0_20px_50px_rgba(18,38,79,0.06)]">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Create New Job</h2>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <div className="space-y-4">
        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-line p-3"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-line p-3"
        />
        <input
          placeholder="Requirements (comma separated)"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full rounded-xl border border-line p-3"
        />
        <button type="submit" className="rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground">
          Create Job
        </button>
      </div>
    </form>
  );
}
