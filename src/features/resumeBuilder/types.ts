export interface DocumentConversionResponse {
  success: boolean;
  filename: string;
  text: string;
  char_count: number;
  message: string;
  error?: string;
}
