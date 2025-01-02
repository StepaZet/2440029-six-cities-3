import { injectable, inject } from 'inversify';
import { DIName } from '../shared/libs/di/di.enum.js';
import { Logger } from '../shared/libs/logging/logger.interface.js';
import { Config } from '../shared/libs/config/config.interface.js';
import { AppSchema } from '../shared/libs/config/app.schema.js';
import { DBClient } from '../shared/libs/db/db-client.interface.js';
import { Controller } from '../shared/libs/rest/controller.interface.js';
import { ExceptionFilter } from '../shared/libs/rest-exceptions/exception-filter.interface.js';
import express from 'express';
import { getMongoUri } from '../shared/helpers/db.js';
import { CorsMiddleware } from '../shared/libs/rest-middlewares/cors.js';
import { LoggingMiddleware } from '../shared/libs/rest-middlewares/logging.js';


@injectable()
export class App {
  constructor(
    @inject(DIName.Logger) private readonly logger: Logger,
    @inject(DIName.Config) private readonly config: Config<AppSchema>,
    @inject(DIName.DBClient) private readonly databaseClient: DBClient,
    @inject(DIName.UserController) private readonly userController: Controller,
    @inject(DIName.OfferController) private readonly offerController: Controller,
    @inject(DIName.CommentController) private readonly commentController: Controller,
    @inject(DIName.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter
  ) {}

  public async init() {
    this.logger.info('Connecting to database...');
    await this.initDb();
    this.logger.info('Success!');
    this.logger.info(`App is running on port ${this.config.get('PORT')}`);

    const app = express();

    this.configureMiddlewares(app);

    app.use(this.userController.prefix, this.userController.router);
    app.use(this.offerController.prefix, this.offerController.router);
    app.use(this.commentController.prefix, this.commentController.router);

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
    const corsMiddleware = new CorsMiddleware();
    const loggingMiddleware = new LoggingMiddleware(this.logger);

    app.use(express.json());
    app.use(express.static(this.config.get('STATIC_ROOT')));
    app.use(corsMiddleware.handleAsync.bind(corsMiddleware));
    app.use(loggingMiddleware.handleAsync.bind(loggingMiddleware));
  }
}
