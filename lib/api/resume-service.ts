import { ResumeParserService } from "../services/resume-parser.service";

export class ResumeService {
  constructor(private readonly resumeParserService = new ResumeParserService()) {}

  async parseResume(fileName: string) {
    return this.resumeParserService.process({ fileName });
  }
}
