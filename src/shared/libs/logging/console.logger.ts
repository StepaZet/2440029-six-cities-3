import { Logger } from './logger.interface.js';

export class ConsoleLogger implements Logger {
  public error(message: string, ...args: unknown[]): void {
    console.error(message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(message, ...args);
  }
}
