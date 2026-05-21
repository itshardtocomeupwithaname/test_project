const toBool = (val) => {
  if (val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return val ? console.log : false;
};

/** @type {import('sequelize').Options} */
module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME,
    port: process.env.DEV_DB_PORT,
    dialect: process.env.DEV_DB_DIALECT,
    logging: toBool(process.env.DEV_DB_LOGGING),
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOSTNAME,
    port: process.env.TEST_DB_PORT,
    dialect: process.env.TEST_DB_DIALECT,
    logging: toBool(process.env.TEST_DB_LOGGING),
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: process.env.PROD_DB_DIALECT,
    logging: toBool(process.env.PROD_DB_LOGGING),
  },
};
