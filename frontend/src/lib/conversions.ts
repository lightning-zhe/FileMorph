import type { SourceFormat, TargetFormat } from '../types';

export const TARGET_FORMATS: Record<SourceFormat, TargetFormat[]> = {
  docx: ['pdf'],
  pptx: ['pdf', 'png'],
  pdf: ['docx', 'png'],
};

export const FORMAT_LABELS: Record<string, string> = {
  docx: 'DOCX (Word 文档)',
  pdf: 'PDF',
  png: 'PNG (图片)',
};

export function detectSourceFormat(filename: string): SourceFormat | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'docx') return 'docx';
  if (ext === 'pptx') return 'pptx';
  if (ext === 'pdf') return 'pdf';
  return null;
}

export function getTargetLabel(fmt: TargetFormat): string {
  return FORMAT_LABELS[fmt] ?? fmt.toUpperCase();
}
