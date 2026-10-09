import { Cpu, FileText } from 'lucide-react';

const STEPS = [
  {
    icon: Cpu,
    title: 'Analyze locally',
    description: 'MissMate scans the text in your browser — no data leaves your device.',
  },
  {
    icon: FileText,
    title: 'Get your report',
    description: 'Review summaries, priorities, tasks, decisions, and deadlines at a glance.',
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#171b1b] p-4 shadow-sm transition-shadow hover:border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e4b37b]/10 text-[#e4b37b]">
                <step.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <span className="text-xs font-semibold text-[#626a66]">
                Step {i + 1}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[#f4f1ea]">{step.title}</h3>
            <p className="text-sm leading-relaxed text-[#a7ada8]">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#e4b37b]/20 bg-[#e4b37b]/10 px-4 py-3">
        <span className="mt-0.5 text-base">🔒</span>
        <p className="text-sm leading-relaxed text-[#e8c69e]">
          <strong>Privacy note:</strong> Your pasted messages are processed
          entirely in your browser. Nothing is uploaded or stored. Avoid pasting
          sensitive personal information.
        </p>
      </div>

      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
        <p className="text-xs leading-relaxed text-[#929793]">
          <strong className="font-semibold text-[#a7ada8]">Prototype notice:</strong>{' '}
          MissMate AI uses keyword and rule-based heuristic analysis — not a true AI
          language model. It can miss sarcasm, context, implied tasks, or exact
          deadlines. Always verify important details against the original messages.
        </p>
      </div>
    </section>
  );
}
