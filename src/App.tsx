import { useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import { Header } from '@/components/Header';
import { HowItWorks } from '@/components/HowItWorks';
import { InputPanel } from '@/components/InputPanel';
import { Report } from '@/components/Report';
import { Footer } from '@/components/Footer';
import { analyzeConversation } from '@/lib/analyzer';
import type { AnalysisResult } from '@/lib/types';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messageCount = useMemo(
    () =>
      input
        .split('\n')
        .filter((line) => line.trim().length > 0).length,
    [input]
  );

  const handleAnalyze = () => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      setError('Please paste some messages first, or click "Load sample chat" to try it out.');
      setResult(null);
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    setTimeout(() => {
      const analysis = analyzeConversation(input);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 600);
  };

  const handlePasteError = (message: string | null) => {
    setError(message);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#101313] text-[#f4f1ea] antialiased">
      <Header />
      <main className="pb-8">
        <HowItWorks />
        <InputPanel
          value={input}
          onChange={(v) => {
            setInput(v);
            if (error) setError(null);
          }}
          onAnalyze={handleAnalyze}
          onClear={handleClear}
          isAnalyzing={isAnalyzing}
          onPasteError={handlePasteError}
          messageCount={messageCount}
          error={error}
        />

        {result && !isAnalyzing && (
          <div className="mt-1">
            <Report result={result} />
          </div>
        )}

        {!result && !isAnalyzing && !error && (
          <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-[#171b1b] py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] text-[#626a66]">
                <Inbox className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-sm font-semibold text-[#b7bcb7]">
                Your catch-up report will appear here
              </h2>
              <p className="mt-1 max-w-sm text-sm text-[#929793]">
                Paste a conversation above and click "Analyze conversation" to
                get started. Or try the sample chat!
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
