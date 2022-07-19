const express = require("express")
const router = express.Router()

const Client = require("../models/Client")

router.post("/", async function clientPostHandler(req, res) {
  const clientDocument = new Client({ ...req.body })
  try {
    const createdClient = await clientDocument.save()
    res.json(createdClient)
  }
  catch (error) {
    console.error(error.message)
    res.error(error.message)
  }
})

router.get("/", async function getAllClientsHandler(req, res) {
  const clients = await Client.find().populate("projects")
  res.json(clients)
})

router.route("/:id")
  .get(async function clientGetByIdHandler(req, res) {
    const { id } = req.params
    const foundClient = await Client.findById(id)
    res.json(foundClient)
  })

  .put(async function clientPutHandler(req, res) {
    const { id } = req.params
    const updatedClient = await Client.updateOne({ _id: id }, { ...req.body })
    res.json(updatedClient)
  })

  .delete(async function clientDeleteHandler(req, res) {
    const { id } = req.params
    const deletedClient = await Client.deleteOne({ _id: id })
    res.json(deletedClient)
  })

router.param("id", function clientRouterParamIdHandler(req, res, next, id) {
  next()
  console.log(`Client id is: ${id}`)
})

module.exports = router