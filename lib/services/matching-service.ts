export type MatchCandidate = {
  id: string;
  name: string;
  score: number;
};

export type MatchingInput = {
  query: string;
  limit?: number;
};

export class MatchingService {
  async findMatches(input: MatchingInput): Promise<MatchCandidate[]> {
    const limit = input.limit ?? 5;

    return Array.from({ length: limit }, (_, index) => ({
      id: `match-${index + 1}`,
      name: `${input.query || "Candidate"} ${index + 1}`,
      score: 100 - index * 7,
    }));
  }
}
