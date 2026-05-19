export type SourceFormat = 'docx' | 'pptx' | 'pdf' | 'image';

export type TargetFormat = 'pdf' | 'docx' | 'png' | 'html' | 'image-pdf';

export interface PageFile {
  page: number;
  filename: string;
  download_url: string;
}

export interface ConversionResult {
  result_type: 'single_file' | 'multiple_images';
  source_format: SourceFormat;
  target_format: TargetFormat;
  download_url: string;
  original_filename: string;
  output_extension: string;
  files: PageFile[];
  zip_url: string | null;
}

export type ConversionStatus = 'idle' | 'waking' | 'converting' | 'success' | 'error';
