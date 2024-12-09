import { AccommodationType, ConvenienceType, RentOffer } from '../../models/rent-offer.js';

export class OfferTsvParser {
  constructor() {}

  parse(rawString: string): RentOffer {
    const trimString = rawString.trim();

    if (!trimString) {
      throw new Error('rawString should not be empty');
    }

    const splitString = trimString.split('\t');
    const [title, description, date, city, previewImage, images, isPremium, isFavorite, rating, type, roomCount, guestCount, rentPrice, conveniences, authorUrl, latitude, longitude] = splitString;

    return {
      title,
      description,
      date: new Date(date),
      city: city,
      previewImage,
      images: images.split(';'),
      isPremium: Boolean(isPremium),
      isFavorite: Boolean(isFavorite),
      rating: Number(rating),
      type: type as AccommodationType,
      roomCount: Number(roomCount),
      guestCount: Number(guestCount),
      rentPrice: Number(rentPrice),
      conveniences: conveniences
        .split(';')
        .map((convenience) => convenience as ConvenienceType),
      authorUrl,
      latitude: Number(latitude),
      longitude: Number(longitude),
      commentCount: 0
    };
  }

  toString(offer: RentOffer): string {
    return [
      offer.title, offer.description, offer.date, offer.city,
      offer.previewImage, offer.images.join(';'), offer.isPremium, offer.isFavorite,
      offer.rating, offer.type, offer.roomCount, offer.guestCount,
      offer.rentPrice, offer.conveniences.join(';'), offer.authorUrl, offer.latitude, offer.longitude
    ].join('\t');
  }
}
