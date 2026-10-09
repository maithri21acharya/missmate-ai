import type {
  AnalysisResult,
  CategoryDefinition,
  ParsedMessage,
  MessageCategory,
} from './types';
import { SAMPLE_CHAT } from './sampleChat';

export { SAMPLE_CHAT };

const URGENCY_KEYWORDS = [
  'urgent',
  'asap',
  'due today',
  'deadline',
  'submit before',
  'important',
  'critical',
  'immediately',
  'right away',
  'as soon as possible',
  'don\'t forget',
  'do not forget',
  'reminder',
];

const TASK_KEYWORDS = [
  'please',
  'finish',
  'complete',
  'send',
  'upload',
  'prepare',
  'confirm',
  'remember to',
  'need to',
  'don\'t forget',
  'make sure',
  'submit',
  'bring',
  'review',
  'cite',
  'finalize',
  'check',
];

const DECISION_KEYWORDS = [
  'decided',
  'confirmed',
  'agreed',
  'moved to',
  'moved the',
  'rescheduled',
  'cancelled',
  'canceled',
  'approved',
  'rejected',
  'changed',
  'switched',
  "let's go with",
  'let us go with',
  "we'll use",
  'we will use',
];

const EVENT_KEYWORDS = [
  'meeting',
  'presentation',
  'deadline',
  'exam',
  'test',
  'quiz',
  'class',
  'lecture',
  'dry run',
  'appointment',
  'scheduled',
];

const DATE_TIME_PATTERNS: RegExp[] = [
  /\b\d{1,2}[/-]\d{1,2}([/-]\d{2,4})?\b/i,
  /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\s+\d{1,2}\b/i,
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  /\b(tomorrow|today|tonight|next week|next month|this weekend|this week|end of (?:the )?(?:day|week|month))\b/i,
  /\b\d{1,2}:\d{2}\s*(?:am|pm)?\b/i,
  /\b\d{1,2}\s*(?:am|pm)\b/i,
];

const CATEGORIES: CategoryDefinition[] = [
  { key: 'priority', label: 'Priority', keywords: URGENCY_KEYWORDS },
  { key: 'action', label: 'Action Item', keywords: TASK_KEYWORDS },
  { key: 'decision', label: 'Decision', keywords: DECISION_KEYWORDS },
];

function splitMessages(input: string): string[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function parseSender(line: string): { sender: string | null; content: string } {
  const match = line.match(/^([^:]{1,30}):\s*(.*)$/s);
  if (match) {
    const sender = match[1].trim();
    const content = match[2].trim();
    if (sender.length > 0 && content.length > 0) {
      return { sender, content };
    }
  }
  return { sender: null, content: line };
}

function containsKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function matchesDateTime(text: string): boolean {
  return DATE_TIME_PATTERNS.some((pattern) => pattern.test(text));
}

function isEventMessage(text: string): boolean {
  return containsKeyword(text, EVENT_KEYWORDS) || matchesDateTime(text);
}

function classifyMessage(content: string): {
  categories: MessageCategory[];
  urgencyScore: number;
} {
  const categories: MessageCategory[] = [];
  let urgencyScore = 0;

  if (containsKeyword(content, URGENCY_KEYWORDS)) {
    categories.push('priority');
    urgencyScore += 3;
  }

  if (containsKeyword(content, TASK_KEYWORDS)) {
    categories.push('action');
    urgencyScore += 1;
  }

  if (containsKeyword(content, DECISION_KEYWORDS)) {
    categories.push('decision');
    urgencyScore += 1;
  }

  if (isEventMessage(content)) {
    categories.push('event');
    urgencyScore += 1;
  }

  if (categories.length === 0) {
    categories.push('other');
  }

  return { categories, urgencyScore };
}

function buildSummary(messages: ParsedMessage[]): string {
  const total = messages.length;
  const senders = new Set(messages.map((m) => m.sender).filter(Boolean));
  const participantCount = senders.size;

  const topics: string[] = [];
  const hasDeadlines = messages.some((m) =>
    m.categories.includes('event') &&
    m.content.toLowerCase().match(/deadline|due|submit/)
  );
  const hasMeetings = messages.some((m) =>
    m.content.toLowerCase().includes('meeting') ||
    m.content.toLowerCase().includes('dry run')
  );
  const hasTasks = messages.some((m) => m.categories.includes('action'));
  const hasDecisions = messages.some((m) => m.categories.includes('decision'));

  if (hasDeadlines) topics.push('upcoming deadlines');
  if (hasMeetings) topics.push('scheduled meetings');
  if (hasTasks) topics.push('assigned tasks');
  if (hasDecisions) topics.push('team decisions');

  const senderNames = Array.from(senders).slice(0, 5).join(', ');

  let summary = `This conversation contains ${total} message${total !== 1 ? 's' : ''}`;
  if (participantCount > 0) {
    summary += ` from ${participantCount} participant${participantCount !== 1 ? 's' : ''}`;
    if (senderNames) summary += ` (${senderNames})`;
  }
  summary += '.';

  if (topics.length > 0) {
    summary += ` Key topics include ${topics.join(', ')}.`;
  } else {
    summary += ' No specific deadlines, tasks, or decisions were detected.';
  }

  return summary;
}

export function analyzeConversation(input: string): AnalysisResult {
  const lines = splitMessages(input);

  const messages: ParsedMessage[] = lines.map((line, index) => {
    const { sender, content } = parseSender(line);
    const { categories, urgencyScore } = classifyMessage(content);
    return {
      id: index,
      raw: line,
      sender,
      content,
      categories,
      urgencyScore,
    };
  });

  const priorityMessages = messages
    .filter((m) => m.categories.includes('priority'))
    .sort((a, b) => b.urgencyScore - a.urgencyScore);

  const actionItems = messages.filter((m) =>
    m.categories.includes('action')
  );

  const decisions = messages.filter((m) =>
    m.categories.includes('decision')
  );

  const datesAndEvents = messages.filter((m) =>
    m.categories.includes('event')
  );

  const classifiedIds = new Set([
    ...priorityMessages.map((m) => m.id),
    ...actionItems.map((m) => m.id),
    ...decisions.map((m) => m.id),
    ...datesAndEvents.map((m) => m.id),
  ]);

  const otherMessages = messages.filter(
    (m) => !classifiedIds.has(m.id)
  );

  const senders = new Set(messages.map((m) => m.sender).filter(Boolean));

  return {
    messages,
    summary: buildSummary(messages),
    priorityMessages,
    actionItems,
    decisions,
    datesAndEvents,
    otherMessages,
    stats: {
      total: messages.length,
      participants: senders.size,
      actionItems: actionItems.length,
      priorityMessages: priorityMessages.length,
      decisions: decisions.length,
      datesAndEvents: datesAndEvents.length,
    },
  };
}

export function generateReportText(result: AnalysisResult): string {
  const lines: string[] = [];
  lines.push('=== MissMate AI — Catch-Up Report ===');
  lines.push('');
  lines.push('QUICK SUMMARY');
  lines.push(result.summary);
  lines.push('');
  lines.push('--- STATISTICS ---');
  lines.push(`Messages analyzed: ${result.stats.total}`);
  lines.push(`Participants: ${result.stats.participants}`);
  lines.push(`Priority messages: ${result.stats.priorityMessages}`);
  lines.push(`Action items: ${result.stats.actionItems}`);
  lines.push(`Decisions: ${result.stats.decisions}`);
  lines.push(`Dates & events: ${result.stats.datesAndEvents}`);
  lines.push('');

  const formatMessage = (m: ParsedMessage): string =>
    m.sender ? `${m.sender}: ${m.content}` : m.content;

  lines.push('--- PRIORITY MESSAGES ---');
  if (result.priorityMessages.length > 0) {
    result.priorityMessages.forEach((m, i) => {
      lines.push(`${i + 1}. ${formatMessage(m)}`);
    });
  } else {
    lines.push('No urgent or high-priority messages detected.');
  }
  lines.push('');

  lines.push('--- ACTION ITEMS ---');
  if (result.actionItems.length > 0) {
    result.actionItems.forEach((m, i) => {
      lines.push(`[ ] ${i + 1}. ${formatMessage(m)}`);
    });
  } else {
    lines.push('No action items detected.');
  }
  lines.push('');

  lines.push('--- DECISIONS & CHANGES ---');
  if (result.decisions.length > 0) {
    result.decisions.forEach((m, i) => {
      lines.push(`${i + 1}. ${formatMessage(m)}`);
    });
  } else {
    lines.push('No decisions or changes detected.');
  }
  lines.push('');

  lines.push('--- DATES & EVENTS ---');
  if (result.datesAndEvents.length > 0) {
    result.datesAndEvents.forEach((m, i) => {
      lines.push(`${i + 1}. ${formatMessage(m)}`);
    });
  } else {
    lines.push('No dates or events detected.');
  }
  lines.push('');

  lines.push('--- OTHER MESSAGES ---');
  if (result.otherMessages.length > 0) {
    result.otherMessages.forEach((m, i) => {
      lines.push(`${i + 1}. ${formatMessage(m)}`);
    });
  } else {
    lines.push('No unclassified messages.');
  }
  lines.push('');
  lines.push('Note: This report was generated using heuristic keyword analysis,');
  lines.push('not a true AI model. Please verify important details against the');
  lines.push('original messages.');

  return lines.join('\n');
}
