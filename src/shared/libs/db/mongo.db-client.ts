import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { DIType } from '../di/di.enum.js';
import { DBClient } from './db-client.interface.js';
import { Logger } from '../logging/logger.interface.js';

@injectable()
export class MongoDatabaseClient implements DBClient {
  private mongoose: typeof Mongoose | undefined;

  constructor(
    @inject(DIType.Logger) private readonly logger: Logger
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Trying to connect to MongoDB');

    try {
      this.mongoose = await Mongoose.connect(uri);
    } catch (error: unknown) {
      this.logger.error('Failed to connect to the database', error as Error);
      throw error;
    }

    this.logger.info('Database connection established');
  }

  public async disconnect(): Promise<void> {
    if (this.mongoose === undefined) {
      return;
    }

    await this.mongoose.disconnect?.();
    this.logger.info('Database connection closed');
  }
}
