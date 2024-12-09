import { User } from './user.js';

export enum AccommodationType {
  apartment = 'Apartment',
  house = 'House',
  room = 'Room',
  hotel = 'Hotel'
}

export enum ConvenienceType {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendlyWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge'
}

export enum CityType {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf'
}

export type RentOffer = {
  name: string,
  description: string,
  createdAt: Date,
  city: CityType,
  previewUrl: string,
  imagesUrls: string[],
  isPremium: boolean,
  isFavorite: boolean,
  rating: number,
  accommodationType: AccommodationType,
  roomCount: number,
  guestCount: number,
  rentPrice: number,
  conveniences: ConvenienceType[],
  author: User,
  latitude: number,
  longitude: number,
  commentCount: number,
}
