const { DB_HOST, DB_NAME, DB_USER_PASSWORD } = require("./database")
const mongoose = require("mongoose")

const connectionString =
  process.env.IS_HEROKU === "true"
    ? `mongodb+srv://dbuser:${DB_USER_PASSWORD}@cluster0.fmcc5.mongodb.net/?retryWrites=true&w=majority`
    : `mongodb://${DB_HOST}/${DB_NAME}`

mongoose.connect(connectionString, { useNewUrlParser: true })

mongoose.connection
  .once("open", function connected() {
    console.log("Connected [Mongoose - MongoDB]")
  })
  .on("error", function error(error) {
    console.log("Failed to connect [Mongoose - MongoDB]", error)
  })
