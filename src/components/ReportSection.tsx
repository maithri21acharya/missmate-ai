import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ParsedMessage } from '@/lib/types';

interface ReportSectionProps {
  title: string;
  icon: ReactNode;
  accentClass: string;
  messages: ParsedMessage[];
  emptyMessage: string;
  defaultOpen?: boolean;
  renderMessage?: (msg: ParsedMessage, index: number) => ReactNode;
  children?: ReactNode;
}

export function ReportSection({
  title,
  icon,
  accentClass,
  messages,
  emptyMessage,
  defaultOpen = true,
  renderMessage,
  children,
}: ReportSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#171b1b] shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e4b37b]/30"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accentClass}`}>
            {icon}
          </span>
          <h3 className="text-sm font-semibold text-[#f4f1ea]">
            {title}
            <span className="ml-2 text-xs font-normal text-[#929793]">
              ({messages.length})
            </span>
          </h3>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#929793] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-white/10 px-5 py-3">
          {messages.length === 0 ? (
            <p className="py-3 text-sm italic text-[#929793]">{emptyMessage}</p>
          ) : (
            <ul className="space-y-1.5">
              {messages.map((msg, i) =>
                renderMessage ? (
                  <li key={msg.id}>{renderMessage(msg, i)}</li>
                ) : (
                  <li key={msg.id}>
                    <MessageCard message={msg} index={i} />
                  </li>
                )
              )}
            </ul>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

function MessageCard({ message, index }: { message: ParsedMessage; index: number }) {
  return (
    <div className="rounded-lg bg-white/[0.04] px-3.5 py-2.5">
      <div className="flex items-baseline gap-2">
        {message.sender && (
          <span className="shrink-0 text-xs font-semibold text-[#e4b37b]">
            {message.sender}
          </span>
        )}
        <span className="text-xs text-[#626a66]">#{index + 1}</span>
      </div>
      <p className="mt-0.5 text-sm leading-relaxed text-[#e9e6de]">
        {message.content}
      </p>
    </div>
  );
}
