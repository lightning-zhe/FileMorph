import { useState, useCallback } from 'react';
import type { ConversionResult, ConversionStatus } from '../types';
import { convertFile } from '../lib/api';

export function useConverter() {
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');

  const convert = useCallback(async (file: File, targetFormat: string) => {
    setStatus('waking');
    setError('');
    setResult(null);

    try {
      const data = await convertFile(file, targetFormat);
      setResult(data);
      setStatus('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError('');
  }, []);

  return { status, result, error, convert, reset };
}
