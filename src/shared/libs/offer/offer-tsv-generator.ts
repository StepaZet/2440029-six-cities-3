import dayjs from 'dayjs';
import { OfferTsvParser } from './offer-tsv-parser.js';
import { AccommodationType, CityType, ConvenienceType, RentOffer } from '../../models/rent-offer.js';
import { MockServerData } from '../../models/mock-server-data.js';
import { Generator } from './generator.interface.js';
import { generateRandomBoolean as getRandomBoolean, getRandomEnumValue, getRandomEnumValues, getRandomInt, getRandomItem, getRandomItems, getRandomNumber, getRandomUser } from '../../helpers/random.js';

const MIN_DAY_OFFSET = 0;
const MAX_DAY_OFFSET = 14;

const MIN_OFFER_ID = 0;
const MAX_OFFER_ID = 99999;

const MIN_RATING = 1.0;
const MAX_RATING = 5.0;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_COST = 100;
const MAX_COST = 100_000;

export class OfferTsvGenerator implements Generator {
  constructor(private readonly mockData: MockServerData) {}

  generate(): string {
    const offerId = getRandomInt(MIN_OFFER_ID, MAX_OFFER_ID);

    const offer: RentOffer = {
      name: getRandomItem(this.mockData.names),
      description: getRandomItem(this.mockData.descriptions),
      createdAt: dayjs()
        .subtract(getRandomInt(MIN_DAY_OFFSET, MAX_DAY_OFFSET))
        .toDate(),
      city: getRandomEnumValue(CityType),
      previewUrl: `https://six-cities.ru/images/${offerId}/0`,
      imagesUrls: getRandomItems([
        `https://six-cities.ru/images/${offerId}/1`,
        `https://six-cities.ru/images/${offerId}/2`,
        `https://six-cities.ru/images/${offerId}/3`,
        `https://six-cities.ru/images/${offerId}/4`,
        `https://six-cities.ru/images/${offerId}/5`,
      ]),
      isPremium: getRandomBoolean(),
      isFavorite: getRandomBoolean(),
      rating: getRandomNumber(MIN_RATING, MAX_RATING, 1),
      accommodationType: getRandomEnumValue(AccommodationType),
      roomCount: getRandomInt(MIN_ROOMS, MAX_ROOMS),
      guestCount: getRandomInt(MIN_GUESTS, MAX_GUESTS),
      rentPrice: getRandomNumber(MIN_COST, MAX_COST, 2),
      conveniences: getRandomEnumValues(ConvenienceType),
      author: getRandomUser(),
      latitude: getRandomNumber(0, 90, 6),
      longitude: getRandomNumber(0, 180, 6),
      commentCount: 0,
    };
    const parser = new OfferTsvParser();

    return parser.toString(offer);
  }
}


