import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return NextResponse.json({
    id,
    kind: "resume",
    message: "Resume detail endpoint scaffolded.",
  });
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return NextResponse.json({
    id,
    kind: "resume_extraction_update",
    message: "Resume extraction update endpoint scaffolded.",
  });
}
