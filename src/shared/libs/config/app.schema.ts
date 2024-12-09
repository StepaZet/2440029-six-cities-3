import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type AppSchema = {
  PORT: number,
  DATABASE_URI: string,
  SALT: string
}

export const configAppSchema = convict<AppSchema>({
  PORT: {
    doc: 'Port',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  DATABASE_URI: {
    doc: 'Database uri',
    format: 'url',
    env: 'DATABASE_URI',
    default: null
  },
  SALT: {
    doc: 'Salt',
    format: String,
    env: 'SALT',
    default: null
  },
});
