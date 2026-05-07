import { NextResponse } from "next/server";
import { ResumeService } from "@/lib/api";

const resumeService = new ResumeService();

export async function POST() {
  const extraction = await resumeService.parseResume("sample-resume.pdf");

  return NextResponse.json({
    workflow: [
      "Upload file",
      "Extract text",
      "Load recruitment.skill.md",
      "AI structured extraction",
      "Validate with Zod",
      "Save ResumeExtraction",
      "Update Candidate profile",
    ],
    extraction,
  });
}
