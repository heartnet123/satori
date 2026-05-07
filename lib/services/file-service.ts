export type StoredFile = {
  id: string;
  name: string;
  status: "uploaded" | "parsed" | "indexed";
};

export class FileService {
  async listRecentFiles(): Promise<StoredFile[]> {
    return [
      { id: "file-1", name: "john_doe_resume.pdf", status: "parsed" },
      { id: "file-2", name: "sarah_lee_resume.pdf", status: "parsed" },
    ];
  }
}
