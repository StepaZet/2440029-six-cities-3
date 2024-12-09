export interface Config<Schema> {
  get<T extends keyof Schema>(key: T): Schema[T];
}
