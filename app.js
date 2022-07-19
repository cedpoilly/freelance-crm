require('dotenv').config()

require('./configs/database-connect')

const express = require("express")
const bodyParser = require('body-parser')

const app = express()

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())


app.get('/', function rootGetHandler(req, res) {
  console.log("Hello")
  res.download("app.js")
})

const clientRouter = require("./controllers/Client")
app.use("/clients", clientRouter)

const projectRouter = require("./controllers/Project")
app.use("/projects", projectRouter)


app.listen("3000")