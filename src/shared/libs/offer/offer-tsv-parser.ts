import { AccommodationType, CityType, ConvenienceType, RentOffer } from '../../models/rent-offer.js';
import { UserType } from '../../models/user.js';

export class OfferTsvParser {
  constructor() {}

  parse(rawString: string): RentOffer {
    const [name, description, createdAt, city, previewUrl, imagesUrls, isPremium, isFavorite, rating, type, roomCount, guestCount, rentPrice, conveniences, author, authorEmail, authorPassword, latitude, longitude] = rawString.trim().split('\t');

    return {
      name,
      description,
      createdAt: new Date(createdAt),
      city: city as CityType,
      previewUrl,
      imagesUrls: imagesUrls.split(';'),
      isPremium: Boolean(isPremium),
      isFavorite: Boolean(isFavorite),
      rating: Number(rating),
      accommodationType: type as AccommodationType,
      roomCount: Number(roomCount),
      guestCount: Number(guestCount),
      rentPrice: Number(rentPrice),
      conveniences: conveniences
        .split(';')
        .map((convenience) => convenience as ConvenienceType),
      author: {
        email: authorEmail,
        name: author,
        type: UserType.common,
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Jones_and_Ellen_Ripley.webp/258px-Jones_and_Ellen_Ripley.webp.png',
        password: authorPassword,
      },
      latitude: Number(latitude),
      longitude: Number(longitude),
      commentCount: 0
    };
  }

  toString(offer: RentOffer): string {
    return [
      offer.name, offer.description, offer.createdAt, offer.city,
      offer.previewUrl, offer.imagesUrls.join(';'), offer.isPremium, offer.isFavorite,
      offer.rating, offer.accommodationType, offer.roomCount, offer.guestCount,
      offer.rentPrice, offer.conveniences.join(';'), offer.author.name, offer.author.email, offer.author.password, offer.latitude, offer.longitude
    ].join('\t');
  }
}
