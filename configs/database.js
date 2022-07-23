require('dotenv').config()

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER_NAME: process.env.DB_USER_NAME,
  DB_USER_PASSWORD: process.env.DB_USER_PASSWORD,
}