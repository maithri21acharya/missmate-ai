import { MessageSquareText, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-[#101313]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-[#929793]">
            <MessageSquareText className="h-4 w-4 text-[#e4b37b]" />
            <span>
              <strong className="font-semibold text-[#b7bcb7]">MissMate AI</strong> —
              Catch up. Focus on what matters.
            </span>
          </div>
          <p className="flex items-center gap-1 text-xs text-[#929793]">
            Built for the hackathon with <Heart className="h-3 w-3 text-[#c98282]" /> —
            privacy-first, runs in your browser
          </p>
        </div>
      </div>
    </footer>
  );
}
