import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/api";

const dashboardService = new DashboardService();

export async function GET() {
  const data = await dashboardService.getOverview();

  return NextResponse.json(data);
}
