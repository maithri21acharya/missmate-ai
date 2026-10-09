import { useState } from 'react';
import {
  Copy,
  Check,
  AlignLeft,
  AlertTriangle,
  CheckSquare,
  Gavel,
  CalendarClock,
  MessageCircle,
} from 'lucide-react';
import type { AnalysisResult, ParsedMessage } from '@/lib/types';
import { generateReportText } from '@/lib/analyzer';
import { copyToClipboard } from '@/lib/clipboard';
import { StatsBar } from './StatsBar';
import { ReportSection } from './ReportSection';

interface ReportProps {
  result: AnalysisResult;
}

export function Report({ result }: ReportProps) {
  const [copied, setCopied] = useState(false);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());

  const handleCopy = async () => {
    const text = generateReportText(result);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleItem = (id: number) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderActionItem = (msg: ParsedMessage, index: number) => {
    const isDone = completedItems.has(msg.id);
    return (
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-lg px-3.5 py-2.5 transition-colors ${
          isDone ? 'bg-[#e4b37b]/10' : 'bg-white/[0.04] hover:bg-white/[0.07]'
        }`}
      >
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => toggleItem(msg.id)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-[#101313] text-[#e4b37b] focus:ring-2 focus:ring-[#e4b37b]/30"
          aria-label={`Mark action item ${index + 1} as complete`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            {msg.sender && (
              <span className="shrink-0 text-xs font-semibold text-[#e4b37b]">
                {msg.sender}
              </span>
            )}
          </div>
          <p
            className={`mt-0.5 text-sm leading-relaxed ${
              isDone ? 'text-[#626a66] line-through' : 'text-[#e9e6de]'
            }`}
          >
            {msg.content}
          </p>
        </div>
      </label>
    );
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pt-6 sm:px-6" aria-label="Catch-up report">
      {/* Summary card */}
      <div className="mb-4 rounded-2xl border border-[#e4b37b]/20 bg-gradient-to-br from-[#1c1915] to-[#171b1b] p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e4b37b]/10 text-[#e4b37b]">
              <AlignLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#f4f1ea]">Quick summary</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {result.summary}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-[#171b1b] px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-[#e4b37b]/40 hover:bg-[#e4b37b]/10 hover:text-[#e4b37b] focus:outline-none focus:ring-2 focus:ring-[#e4b37b]/30 active:scale-[0.98]"
            aria-label="Copy full report to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#e4b37b]" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5">
        <StatsBar stats={result.stats} />
      </div>

      {/* Report sections */}
      <div className="space-y-3">
        <ReportSection
          title="Priority messages"
          icon={<AlertTriangle className="h-4 w-4 text-red-300" />}
          accentClass="bg-red-400/10"
          messages={result.priorityMessages}
          emptyMessage="No urgent or high-priority messages detected. You're all caught up!"
        >
          <div className="border-t border-white/10 px-5 py-2">
            <p className="text-xs italic text-[#929793]">
              Priority detection uses keyword heuristics (e.g. "urgent", "ASAP",
              "deadline"). Some messages may be missed — use your judgment.
            </p>
          </div>
        </ReportSection>

        <ReportSection
          title="Action items"
          icon={<CheckSquare className="h-4 w-4 text-[#e4b37b]" />}
          accentClass="bg-[#e4b37b]/10"
          messages={result.actionItems}
          emptyMessage="No action items detected. Nothing requires your immediate action."
          renderMessage={renderActionItem}
        />

        <ReportSection
          title="Decisions & changes"
          icon={<Gavel className="h-4 w-4 text-[#c8b4d9]" />}
          accentClass="bg-[#c8b4d9]/10"
          messages={result.decisions}
          emptyMessage="No decisions or changes were detected in this conversation."
        />

        <ReportSection
          title="Dates & events"
          icon={<CalendarClock className="h-4 w-4 text-[#e4b37b]" />}
          accentClass="bg-[#e4b37b]/10"
          messages={result.datesAndEvents}
          emptyMessage="No dates, deadlines, or events were detected."
          defaultOpen={false}
        >
          <div className="border-t border-white/10 px-5 py-2">
            <p className="text-xs italic text-[#929793]">
              Date and event detection is heuristic. Please verify exact times and
              dates against the original messages.
            </p>
          </div>
        </ReportSection>

        <ReportSection
          title="Other messages"
          icon={<MessageCircle className="h-4 w-4 text-[#929793]" />}
          accentClass="bg-white/[0.06]"
          messages={result.otherMessages}
          emptyMessage="No additional messages — everything was classified above."
          defaultOpen={false}
        />
      </div>
    </section>
  );
}
