import { NextResponse } from "next/server";
import { updateJob } from "@/lib/recruitment";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = updateJob(id);

  if (!job) {
    return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(job);
}
