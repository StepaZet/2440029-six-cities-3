import { getErrorMessage } from '../../shared/helpers/random.js';
import { DBClient } from '../../shared/libs/db/db-client.interface.js';
import { MongoDatabaseClient } from '../../shared/libs/db/mongo.db-client.js';
import { TsvFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { ConsoleLogger } from '../../shared/libs/logging/console.logger.js';
import { Logger } from '../../shared/libs/logging/logger.interface.js';
import { OfferTsvParser } from '../../shared/libs/offer/offer-tsv-parser.js';
import { RentOffer } from '../../shared/models/rent-offer.js';
import { DefaultOfferRepository } from '../../shared/repositories/offer/default.offer-repository.js';
import { OfferModel } from '../../shared/repositories/offer/enteties.js';
import { OfferRepository } from '../../shared/repositories/offer/offer-repository.interface.js';
import { DefaultUserRepository } from '../../shared/repositories/user/default.user-repository.js';
import { UserModel } from '../../shared/repositories/user/enteties.js';
import { UserRepository } from '../../shared/repositories/user/user-repository.interface.js';
import { Command } from './command.interface.js';


export class ImportCommand implements Command {
  private readonly parser: OfferTsvParser = new OfferTsvParser();
  private readonly userRepository: UserRepository;
  private readonly offerRepository: OfferRepository;
  private readonly dbClient: DBClient;
  private readonly logger: Logger;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerRepository = new DefaultOfferRepository(this.logger, OfferModel);
    this.userRepository = new DefaultUserRepository(this.logger, UserModel);
    this.dbClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, databaseConnectionUri: string): Promise<void> {

    await this.dbClient.connect(databaseConnectionUri);
    const reader = new TsvFileReader(filename.trim());

    reader.on('readline', this.onImportedLine);
    reader.on('end', this.onCompleteImport);

    try {
      await reader.read();
    } catch (error: unknown) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${getErrorMessage(error)}`);
    }
  }

  private async onImportedLine(importedLine: string, resolve: () => void): Promise<void> {
    const offer = this.parser.parse(importedLine);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(importedRowCount: number) {
    console.log(`Imported ${importedRowCount} rows`);
    this.dbClient.disconnect();
  }

  private async saveOffer(offer: RentOffer) {
    let user = await this.userRepository.findByEmail(offer.author.email);

    if (user === null) {
      user = await this.userRepository.create(offer.author);
    }

    await this.offerRepository.create({
      name: offer.name,
      description: offer.description,
      createdAt: offer.createdAt,
      city: offer.city,
      previewUrl: offer.previewUrl,
      imagesUrls: offer.imagesUrls,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      accommodationType: offer.accommodationType,
      roomCount: offer.roomCount,
      guestCount: offer.guestCount,
      rentPrice: offer.rentPrice,
      conveniences: offer.conveniences,
      authorId: user.id,
      latitude: offer.latitude,
      longitude: offer.longitude,
      commentCount: offer.commentCount
    });
  }
}
