import { Logger as PinoInstance, pino } from 'pino';
import { Logger } from './logger.interface.js';
import { injectable } from 'inversify';


@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const multiTransport = pino.transport({
      targets: [
        {
          target: 'pino/file',
          options: {},
          level: 'info'
        }
      ]
    });

    this.logger = pino({}, multiTransport);
  }

  info(message: string, ...details: unknown[]): void {
    this.logger.info(message, ...details);
  }

  error(message: string, error: Error, ...details: unknown[]): void {
    this.logger.error(error, message, ...details);
  }
}
