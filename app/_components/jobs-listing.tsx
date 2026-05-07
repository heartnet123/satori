"use client";

import { useEffect, useState } from "react";
import { getJobs } from "@/lib/db/jobs";

export function JobsListing() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getJobs().then((data) => {
      setJobs(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading jobs...</div>;

  return (
    <section className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_20px_50px_rgba(18,38,79,0.06)]">
      <header className="flex items-center justify-between border-b border-line px-6 py-5">
        <h2 className="text-lg font-semibold text-foreground">Available Jobs</h2>
      </header>
      <div className="divide-y divide-line">
        {jobs.map((job) => (
          <div key={job.id} className="px-6 py-5">
            <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
