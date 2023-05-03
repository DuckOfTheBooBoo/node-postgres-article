const CONFIG = {
  POSTGRES_USER: process.env.DB_USER,
  POSTGRES_PASS: process.env.DB_PASS,
  POSTGRES_DB: process.env.DB_NAME,
  POSTGRES_HOST: 'localhost',
};

module.exports = CONFIG;
