import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type AppSchema = {
  PORT: number,
  DATABASE_HOST: string,
  DATABASE_PORT: string,
  DATABASE_USER: string,
  DATABASE_PASSWORD: string,
  DATABASE_NAME: string,
  SALT: string
}

export const configAppSchema = convict<AppSchema>({
  PORT: {
    doc: 'Port',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  DATABASE_HOST: {
    doc: 'Database connection uri',
    format: 'url',
    env: 'DATABASE_HOST',
    default: null
  },
  DATABASE_PORT: {
    doc: 'Database connection port',
    format: 'port',
    env: 'DATABASE_PORT',
    default: '27017'
  },
  DATABASE_USER: {
    doc: 'Database user name',
    format: String,
    env: 'DATABASE_USER',
    default: null
  },
  DATABASE_PASSWORD: {
    doc: 'Database password',
    format: String,
    env: 'DATABASE_PASSWORD',
    default: null
  },
  DATABASE_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DATABASE_NAME',
    default: 'six-cities'
  },
  SALT: {
    doc: 'Salt',
    format: String,
    env: 'SALT',
    default: null
  },
});
