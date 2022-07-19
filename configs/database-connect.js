const { DB_HOST, DB_NAME } = require("./database")
const mongoose = require('mongoose')

mongoose.connect(`mongodb://${DB_HOST}/${DB_NAME}`, { useNewUrlParser: true })

mongoose.connection
  .once('open', function connected() { console.log("Connected [Mongoose - MongoDB]") })
  .on("error", function error(error) { console.log("Failed to connect [Mongoose - MongoDB]", error) })
