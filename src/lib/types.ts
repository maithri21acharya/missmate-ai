export interface ParsedMessage {
  id: number;
  raw: string;
  sender: string | null;
  content: string;
  categories: MessageCategory[];
  urgencyScore: number;
}

export type MessageCategory = 'priority' | 'action' | 'decision' | 'event' | 'other';

export interface AnalysisResult {
  messages: ParsedMessage[];
  summary: string;
  priorityMessages: ParsedMessage[];
  actionItems: ParsedMessage[];
  decisions: ParsedMessage[];
  datesAndEvents: ParsedMessage[];
  otherMessages: ParsedMessage[];
  stats: {
    total: number;
    participants: number;
    actionItems: number;
    priorityMessages: number;
    decisions: number;
    datesAndEvents: number;
  };
}

export interface CategoryDefinition {
  key: Exclude<MessageCategory, 'other'>;
  label: string;
  keywords: string[];
}
