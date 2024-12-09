import { config } from 'dotenv';
import { Config } from './config.interface.js';
import { injectable, inject } from 'inversify';
import { AppSchema, configAppSchema } from './app.schema.js';
import { Logger } from '../logging/logger.interface.js';
import { DIType } from '../di/di.enum.js';

@injectable()
export class AppConfig implements Config<AppSchema> {
  private readonly config: AppSchema;

  constructor(
    @inject(DIType.Logger) private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file');
    }

    configAppSchema.load(parsedOutput.parsed);
    configAppSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configAppSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof AppSchema>(key: T): AppSchema[T] {
    return this.config[key];
  }
}
