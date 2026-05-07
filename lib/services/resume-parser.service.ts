import { extractTextFromPDF } from "./pdf-extractor";
import { normalizeResumeData } from "./gpt4o-normalizer";
import { embeddingService } from "./embedding-service";
import { saveResume } from "../db/resumes";
import { type ResumeExtraction } from "../recruitment/types";

export class ResumeParserService {
  async process(input: { fileName: string; fileBuffer?: ArrayBuffer }): Promise<ResumeExtraction> {
    const uploaded = await this.uploadFile(input.fileName, input.fileBuffer);
    
    // 1. Extract raw text
    let rawText = await this.extractText(uploaded, input.fileBuffer);
    
    // 2. Normalization
    const normalized = await normalizeResumeData(rawText);
    const extraction: ResumeExtraction = {
        id: crypto.randomUUID(),
        fullName: normalized.candidate.fullName,
        title: normalized.headline,
        email: normalized.candidate.email,
        phone: normalized.candidate.phone,
        location: normalized.candidate.location,
        summary: normalized.professionalSummary,
        skills: normalized.skills.raw,
        sourceFileName: uploaded.fileName,
        createdAt: new Date().toISOString(),
    };

    // 3. Generate Vector Embedding
    const embedding = await embeddingService.generateEmbedding(
      extraction.summary + extraction.skills.join(", ")
    );
    
    // 4. Save to Database
    return await saveResume(extraction, uploaded.fileName, { embedding });
  }

  private async uploadFile(fileName: string, _fileBuffer?: ArrayBuffer) {
    return { fileName, fileId: `file_${Date.now()}` };
  }

  private async extractText(uploaded: { fileId: string; fileName: string }, fileBuffer?: ArrayBuffer) {
    if (fileBuffer && uploaded.fileName.toLowerCase().endsWith('.pdf')) {
        return await extractTextFromPDF(fileBuffer);
    }
    return `Extracted text for ${uploaded.fileName} (${uploaded.fileId})`;
  }
}
