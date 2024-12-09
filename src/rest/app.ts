import { injectable, inject } from 'inversify';
import { DIType } from '../shared/libs/di/di.enum.js';
import { Logger } from '../shared/libs/logging/logger.interface.js';
import { Config } from '../shared/libs/config/config.interface.js';
import { AppSchema } from '../shared/libs/config/app.schema.js';
import { DBClient } from '../shared/libs/db/db-client.interface.js';
import { Controller } from '../shared/libs/rest/controller.interface.js';
import { ExceptionFilter } from '../shared/libs/rest-exceptions/exception-filter.interface.js';
import express from 'express';
import { getMongoUri } from '../shared/helpers/db.js';


@injectable()
export class App {
  constructor(
    @inject(DIType.Logger) private readonly logger: Logger,
    @inject(DIType.Config) private readonly config: Config<AppSchema>,
    @inject(DIType.DBClient) private readonly databaseClient: DBClient,
    @inject(DIType.UserController) private readonly userController: Controller,
    @inject(DIType.OfferController) private readonly offerController: Controller,
    @inject(DIType.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter
  ) {}

  public async init() {
    this.logger.info('App is ready');
    this.logger.info(`Found PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database');
    await this.initDb();
    this.logger.info('Init database completed');

    const app = express();

    this.configureMiddlewares(app);

    app.use('/users', this.userController.router);
    app.use('/offers', this.offerController.router);

    app.use(this.exceptionFilter.handle.bind(this.exceptionFilter));

    app.listen(this.config.get('PORT'),
      () => this.logger.info(`Server running on port: ${this.config.get('PORT')}`)
    );
  }

  private async initDb() {
    const mongoUri = getMongoUri(
      this.config.get('DATABASE_HOST'),
      this.config.get('DATABASE_PORT'),
      this.config.get('DATABASE_USER'),
      this.config.get('DATABASE_PASSWORD'),
      this.config.get('DATABASE_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async configureMiddlewares(app: express.Application) {
    app.use(express.json());
    app.use((req, _res, next) => {
      this.logger.info(`Catch request: ${req.method} ${req.url}`);
      next();
    });
  }
}
