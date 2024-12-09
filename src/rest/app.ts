import { injectable, inject } from 'inversify';
import { DIType } from '../shared/libs/di/di.enum.js';
import { Logger } from '../shared/libs/logging/logger.interface.js';
import { Config } from '../shared/libs/config/config.interface.js';
import { AppSchema } from '../shared/libs/config/app.schema.js';

@injectable()
export class App {
  constructor(
    @inject(DIType.Logger) private readonly logger: Logger,
    @inject(DIType.Config) private readonly config: Config<AppSchema>
  ) {}

  public async init() {
    this.logger.info('App is ready');
    this.logger.info(`Found PORT: ${this.config.get('PORT')}`);
  }
}
