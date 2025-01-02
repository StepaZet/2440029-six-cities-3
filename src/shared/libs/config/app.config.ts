import { config } from 'dotenv';
import { Config } from './config.interface.js';
import { injectable, inject } from 'inversify';
import { AppSchema, configAppSchema } from './app.schema.js';
import { Logger } from '../logging/logger.interface.js';
import { DIName } from '../di/di.enum.js';

@injectable()
export class AppConfig implements Config<AppSchema> {
  private readonly config: AppSchema;

  constructor(
    @inject(DIName.Logger) private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(`Error while reading .env: ${parsedOutput.error.message}`);
    }

    configAppSchema.load(parsedOutput.parsed);
    configAppSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configAppSchema.getProperties();
    this.logger.info('Successfuly parsed .env');
  }

  public get<T extends keyof AppSchema>(key: T): AppSchema[T] {
    return this.config[key];
  }
}
