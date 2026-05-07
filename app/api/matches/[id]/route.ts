import { NextResponse } from "next/server";
import { getMatch } from "@/lib/recruitment";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const match = getMatch(id);

  if (!match) {
    return NextResponse.json({ error: "MATCH_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(match);
}
