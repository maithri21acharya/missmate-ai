import type { AnalysisResult } from '@/lib/types';

interface StatsBarProps {
  stats: AnalysisResult['stats'];
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: 'Messages', value: stats.total, color: 'text-[#f4f1ea]', bg: 'bg-white/[0.06]' },
    { label: 'Participants', value: stats.participants, color: 'text-[#9bb7c9]', bg: 'bg-[#9bb7c9]/10' },
    { label: 'Priority', value: stats.priorityMessages, color: 'text-red-300', bg: 'bg-red-400/10' },
    { label: 'Action items', value: stats.actionItems, color: 'text-[#e4b37b]', bg: 'bg-[#e4b37b]/10' },
    { label: 'Decisions', value: stats.decisions, color: 'text-[#c8b4d9]', bg: 'bg-[#c8b4d9]/10' },
    { label: 'Dates & events', value: stats.datesAndEvents, color: 'text-[#e4b37b]', bg: 'bg-[#e4b37b]/10' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex flex-col items-center justify-center rounded-xl ${item.bg} px-2 py-3 text-center`}
        >
          <span className={`text-xl font-bold ${item.color} sm:text-2xl`}>
            {item.value}
          </span>
          <span className="mt-0.5 text-[11px] font-medium leading-tight text-[#929793] sm:text-xs">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
