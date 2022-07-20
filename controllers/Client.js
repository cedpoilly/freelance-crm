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
  const clients = await Client.find()
    .populate("projects")
    .select("-__v")
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

  .delete(async function clientDeleteHandler(req, res, next) {
    const { id } = req.params
    const foundClient = await Client.findById(id)

    if (!foundClient) {
      // * Message to be handled by the front-end application.
      // * The front-end has the liberty to decide how to inform the user.
      return res.json({ message: "cannot_delete_not_found_client" })
    }

    // * To trigger the `pre` middleware in the model (to remove linked entities, ie, `projects`)
    // * we need to call the `.remove` method on a **ModelDocument**.
    // * Hence why first call `Model.findById`, and call `.remove` on it's response.
    const response = await foundClient.remove()
    res.json(response)
  })

router.param("id", function clientRouterParamIdHandler(req, res, next, id) {
  next()
  console.log(`Client id is: ${id}`)
})

module.exports = router