export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiAnswerInput = {
  messages: ChatMessage[];
  model?: string;
};

export type AiAnswerResult = {
  text: string;
  metadata?: Record<string, unknown>;
};

export class AiService {
  async answer(input: AiAnswerInput): Promise<AiAnswerResult> {
    const latestUserMessage = [...input.messages].reverse().find((message) => message.role === "user");

    return {
      text: latestUserMessage?.content ?? "No user message provided.",
      metadata: {
        model: input.model ?? "default",
        messages: input.messages.length,
      },
    };
  }
}
