"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { SearchDocumentIcon } from "./icons";

interface MatchStreamViewProps {
  matchId: string;
  initialExplanation?: string;
}

export function MatchStreamView({ matchId, initialExplanation }: MatchStreamViewProps) {
  const [explanation, setExplanation] = useState(initialExplanation || "");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const streamTriggeredRef = useRef(false);

  const startStreaming = useCallback(() => {
    setIsStreaming(true);
    setError(null);
    
    const eventSource = new EventSource(`/api/matches/${matchId}/stream`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text) {
          setExplanation((prev) => prev + data.text);
        }
      } catch (e) {
        console.error("Failed to parse SSE message", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setError("Failed to stream explanation. Please try refreshing.");
      setIsStreaming(false);
      eventSource.close();
    };

    eventSource.addEventListener("done", () => {
      setIsStreaming(false);
      eventSource.close();
    });
  }, [matchId]);

  useEffect(() => {
    if (!initialExplanation && !streamTriggeredRef.current) {
      streamTriggeredRef.current = true;
      startStreaming();
    }
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [initialExplanation, startStreaming]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          AI Analysis & Explanation
        </h4>
        {isStreaming && (
          <span className="flex items-center gap-2 text-xs font-medium text-primary animate-pulse">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Streaming Analysis...
          </span>
        )}
      </div>

      <div className="relative overflow-hidden rounded-[22px] border border-line bg-surface-muted/50 p-6 shadow-inner">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {!explanation && isStreaming ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
              <SearchDocumentIcon className="h-10 w-10 animate-bounce text-primary" />
              <p className="mt-4 text-sm font-medium">Synthesizing match data...</p>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {explanation}
              {isStreaming && <span className="inline-block w-2 h-5 ml-1 bg-primary animate-pulse align-middle" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
