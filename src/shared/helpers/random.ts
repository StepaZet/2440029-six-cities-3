export function getRandomNumber(min: number, max: number, numDigitsAfterPoint: number = 0): number {
  const randomValue = Math.random() * (max - min) + min;
  const fixedValueString = randomValue.toFixed(numDigitsAfterPoint);
  return Number(fixedValueString);
}

export function getRandomInt(min: number, max: number): number {
  return getRandomNumber(min, max);
}

export function generateRandomBoolean(): boolean {
  return Boolean(getRandomInt(0, 1));
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = getRandomInt(0, items.length - 1);
  const endPosition = getRandomInt(startPosition, items.length - 1);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[getRandomInt(0, items.length - 1)];
}

export function getRandomEnumValue<T extends object>(enumObject: T): T[keyof T] {
  return getRandomItem(Object.values(enumObject));
}

export function getRandomEnumValues<T extends object>(enumObject: T): T[keyof T][] {
  return getRandomItems(Object.values(enumObject));
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}
