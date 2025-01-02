import got from 'got';
import { Command } from './command.interface.js';
import { getErrorMessage } from '../../shared/helpers/random.js';
import { MockServerData } from '../../shared/models/index.js';
import { TsvFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { OfferTsvGenerator } from '../../shared/libs/offer/offer-tsv-generator.js';

export class GenerateCommand implements Command {

  public getName = (): string => '--generate';

  public async execute(...args: string[]): Promise<void> {
    const [count, path, url] = args;
    const offerCount = Number.parseInt(count, 10);

    try {
      const data = await this.load(url);
      await this.write(data, path, offerCount);
      console.info(`File ${path} was created.`);
    } catch (error: unknown) {
      console.error(`Error while generating data. Details: ${getErrorMessage(error)}`);
    }
  }

  private async load(url: string): Promise<MockServerData> {
    try {
      return await got.get(url).json();
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw new Error(`Can't load data from ${url}`);
      }

      throw new Error(`Can't load data from ${url}: ${error.message}`);
    }
  }

  private async write(data: MockServerData, path: string, offerCount: number): Promise<void> {
    const generator = new OfferTsvGenerator(data);
    const writer = new TsvFileWriter(path);

    for (let i = 0; i < offerCount; i++) {
      const row = generator.generate();
      await writer.write(row);
    }
  }
}
