/* eslint-disable max-len */
const CONFIG = {
  POSTGRES_USER: process.env.DB_USER,
  POSTGRES_PASS: process.env.DB_PASS,
  POSTGRES_DB: process.env.DB_NAME,
  POSTGRES_DB_TABLE: Boolean(process.env.DB_TABLE_NAME) ? process.env.DB_TABLE_NAME : 'articles',
  POSTGRES_HOST: process.env.DB_HOST,
};

module.exports = CONFIG;
