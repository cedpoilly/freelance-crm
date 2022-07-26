require('dotenv').config()

require('./configs/database-connect')

const path = require("path")
const express = require("express")
const bodyParser = require('body-parser')
var cors = require('cors')

const app = express()

app.use(express.static('public'))

// configure the app to use bodyParser()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(cors({ origin: "http://127.0.0.1:5000" }))

const clientRouter = require("./controllers/Client")
app.use("/clients", clientRouter)

const projectRouter = require("./controllers/Project")
app.use("/projects", projectRouter)


app.get('*', function (res, res) {
  const filePath = path.resolve(__dirname, './public/index.html')
  res.sendFile(filePath)
})

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message)

  throw error
})

process.on('uncaughtException', error => {
  console.log('uncaughtException', error.message)

  const message = error.message
  const isCannotRead = message.toLowerCase().includes("cannot read")
  if (isCannotRead) {
    process.exit(1)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Express connected")
})