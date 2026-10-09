import { MessageSquareText, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101313]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee9df] shadow-sm">
            <MessageSquareText className="h-5 w-5 text-[#151817]" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-[#f4f1ea] sm:text-lg">
              MissMate <span className="text-[#e4b37b]">AI</span>
            </h1>
            <p className="text-[11px] leading-tight text-[#929793] sm:text-xs">
              Catch up. Focus on what matters.
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-[#e4b37b]/20 bg-[#e4b37b]/10 px-3 py-1.5 text-xs font-medium text-[#e4b37b] sm:flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Processed locally
        </div>
      </div>
    </header>
  );
}
