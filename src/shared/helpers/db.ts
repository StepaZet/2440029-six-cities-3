export function getMongoUri(
  host: string,
  port: string,
  user: string,
  password: string,
  name: string
) {
  return `mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`;
}
