import { useState } from 'react';
import {
  Sparkles,
  ClipboardPaste,
  Eraser,
  FileDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { SAMPLE_CHAT } from '@/lib/analyzer';
import { readFromClipboard } from '@/lib/clipboard';

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
  onPasteError: (message: string | null) => void;
  messageCount: number;
  error: string | null;
}

export function InputPanel({
  value,
  onChange,
  onAnalyze,
  onClear,
  isAnalyzing,
  onPasteError,
  messageCount,
  error,
}: InputPanelProps) {
  const [justLoaded, setJustLoaded] = useState(false);
  const [isPasting, setIsPasting] = useState(false);

  const handleLoadSample = () => {
    onChange(SAMPLE_CHAT);
    setJustLoaded(true);
    setTimeout(() => setJustLoaded(false), 1500);
  };

  const handlePasteFromClipboard = async () => {
    setIsPasting(true);
    onPasteError(null);
    const clipboardText = await readFromClipboard();
    setIsPasting(false);

    if (clipboardText === null) {
      onPasteError('Clipboard access is unavailable. Use Ctrl+V or Cmd+V inside the text area instead.');
      return;
    }

    if (clipboardText.trim().length === 0) {
      onPasteError('Your clipboard is empty. Copy a conversation first, then try again.');
      return;
    }

    onChange(clipboardText);
  };

  const canAnalyze = value.trim().length > 0 && !isAnalyzing && !isPasting;

  return (
    <section className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
      <div className="rounded-2xl border border-white/10 bg-[#171b1b] p-5 shadow-sm sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="chat-input"
            className="text-sm font-semibold text-[#f4f1ea]"
          >
            Paste your conversation
          </label>
          {messageCount > 0 && (
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs font-medium text-[#a7ada8]">
              {messageCount} message{messageCount !== 1 ? 's' : ''} detected
            </span>
          )}
        </div>

        <textarea
          id="chat-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste your group chat here — one message per line.\n\nExample:\nSarah: Hey everyone, don't forget the deadline is Friday.\nMike: Urgent — please send the files ASAP!\nAlex: I'll upload them tonight.\n\nTip: Click "Load sample chat" to try it instantly.`}
          rows={10}
          className="w-full resize-y rounded-xl border border-white/10 bg-[#101313] px-4 py-3 font-mono text-sm leading-relaxed text-[#e9e6de] placeholder:text-[#626a66] transition-colors focus:border-[#e4b37b] focus:bg-[#141818] focus:outline-none focus:ring-2 focus:ring-[#e4b37b]/20"
          aria-label="Conversation input"
        />

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            disabled={isAnalyzing || isPasting}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e4b37b]/25 bg-[#e4b37b]/10 px-4 py-2.5 text-sm font-semibold text-[#e4b37b] shadow-sm transition-all hover:border-[#e4b37b]/50 hover:bg-[#e4b37b]/15 focus:outline-none focus:ring-2 focus:ring-[#e4b37b]/30 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            <ClipboardPaste className="h-4 w-4" />
            {isPasting ? 'Pasting...' : 'Paste from clipboard'}
          </button>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className="inline-flex items-center gap-2 rounded-xl bg-[#eee9df] px-5 py-2.5 text-sm font-semibold text-[#151817] shadow-sm transition-all hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#e4b37b]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze conversation
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#171b1b] px-4 py-2.5 text-sm font-semibold text-[#d0d2ca] shadow-sm transition-all hover:border-white/20 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            <FileDown className="h-4 w-4" />
            {justLoaded ? 'Loaded!' : 'Load sample chat'}
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={isAnalyzing || (value.trim().length === 0 && messageCount === 0)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#171b1b] px-4 py-2.5 text-sm font-semibold text-[#929793] shadow-sm transition-all hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            <Eraser className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}
