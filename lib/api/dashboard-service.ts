import { AiService, FileService, MatchingService } from "../services";

export class DashboardService {
  constructor(
    private readonly aiService = new AiService(),
    private readonly matchingService = new MatchingService(),
    private readonly fileService = new FileService(),
  ) {}

  async getOverview() {
    const [files, matches] = await Promise.all([
      this.fileService.listRecentFiles(),
      this.matchingService.findMatches({ query: "Data Scientist", limit: 3 }),
    ]);

    const summary = await this.aiService.answer({
      messages: [{ role: "user", content: "Summarize dashboard status" }],
      model: "vercel-ai-sdk",
    });

    return {
      files,
      matches,
      summary,
    };
  }
}
