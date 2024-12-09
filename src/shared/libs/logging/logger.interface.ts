export interface Logger {
  info(message: string, ...details: unknown[]): void;
  error(message: string, error: Error, ...details: unknown[]): void;
}
