import { useState, useMemo } from 'react';
import type { SourceFormat, TargetFormat } from './types';
import { detectSourceFormat } from './lib/conversions';
import { useConverter } from './hooks/useConverter';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UploadZone from './components/UploadZone';
import FormatSelector from './components/FormatSelector';
import ConvertButton from './components/ConvertButton';
import ResultPanel from './components/ResultPanel';
import FeatureCards from './components/FeatureCards';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { ArrowRight } from 'lucide-react';

const SUPPORTED = [
  { from: 'DOCX', to: 'PDF' },
  { from: 'PPTX', to: 'PDF' },
  { from: 'PDF', to: 'DOCX' },
  { from: 'PDF', to: 'PNG' },
  { from: 'PPTX', to: 'PNG' },
];

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<TargetFormat | null>(null);
  const { status, result, error, convert, reset } = useConverter();

  const sourceFormat: SourceFormat | null = useMemo(
    () => (file ? detectSourceFormat(file.name) : null),
    [file],
  );

  const handleSelectFile = (f: File) => {
    setFile(f);
    setTargetFormat(null);
    reset();
  };

  const handleConvert = () => {
    if (!file || !targetFormat) return;
    convert(file, targetFormat);
  };

  const handleReset = () => {
    setTargetFormat(null);
    reset();
  };

  const isBusy = status === 'waking';
  const canConvert = file !== null && targetFormat !== null && !isBusy;
  const showForm = status !== 'success';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <HeroSection />

      <main className="max-w-2xl mx-auto px-6 pb-8">
        {/* Upload card */}
        <Card className="animate-slide-up">
          <CardContent className="space-y-5 pt-6">
            <UploadZone
              file={file}
              onSelect={handleSelectFile}
              disabled={isBusy}
            />

            {sourceFormat && showForm && (
              <FormatSelector
                sourceFormat={sourceFormat}
                value={targetFormat}
                onChange={setTargetFormat}
                disabled={isBusy}
              />
            )}

            {sourceFormat && targetFormat && showForm && (
              <ConvertButton
                onClick={handleConvert}
                disabled={!canConvert}
                waking={isBusy}
              />
            )}

            {status === 'error' && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-fade-in">
                <p className="text-sm text-red-700">{error}</p>
                <button onClick={reset} className="mt-2 text-sm text-red-600 underline hover:no-underline">
                  重试
                </button>
              </div>
            )}

            {status === 'success' && result && (
              <ResultPanel result={result} onNewConversion={handleReset} />
            )}
          </CardContent>
        </Card>

        {/* Supported conversions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {SUPPORTED.map((s) => (
            <Badge key={s.from + s.to} variant="outline" className="gap-1">
              {s.from}
              <ArrowRight className="h-3 w-3" />
              {s.to}
            </Badge>
          ))}
        </div>
      </main>

      <FeatureCards />
    </div>
  );
}
