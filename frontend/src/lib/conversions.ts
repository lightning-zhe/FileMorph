import type { SourceFormat, TargetFormat } from '../types';

export const TARGET_FORMATS: Record<SourceFormat, TargetFormat[]> = {
  docx: ['pdf', 'html'],
  pptx: ['pdf', 'png'],
  pdf: ['docx', 'png'],
  image: ['image-pdf'],
};

export const FORMAT_LABELS: Record<string, string> = {
  docx: 'DOCX (Word 文档)',
  pdf: 'PDF',
  png: 'PNG (图片)',
  html: 'HTML (网页)',
  'image-pdf': 'PDF (图片转PDF)',
};

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp'];

export function detectSourceFormat(filename: string): SourceFormat | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'docx') return 'docx';
  if (ext === 'pptx') return 'pptx';
  if (ext === 'pdf') return 'pdf';
  if (ext && IMAGE_EXTS.includes(ext)) return 'image';
  return null;
}

export function getTargetLabel(fmt: TargetFormat): string {
  return FORMAT_LABELS[fmt] ?? fmt.toUpperCase();
}
