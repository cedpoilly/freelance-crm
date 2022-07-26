const express = require("express")
const router = express.Router()

const Project = require("../models/Project")
const Client = require("../models/Client")

router.post("/", async function projectPostHandler(req, res) {
  const projectDocument = new Project({ ...req.body })

  try {
    const createdProject = await projectDocument.save()
    await Client.findByIdAndUpdate(
      createdProject.client._id,
      { $push: { projects: createdProject } },
      {
        new: true,
        // * avoids deprecation warning
        // * https://mongoosejs.com/docs/5.x/docs/deprecations.html#findandmodify
        useFindAndModify: false,
      }
    )
    res.send(createdProject)
  } catch (error) {
    // todo: move to global error handler?
    console.error(error.message)
    res.send(error.message)
  }
})

router.get("/", async function getAllProjectsHandler(req, res) {
  const clientId = req.query.clientId

  const query = clientId ? Project.find({ client: clientId }) : Project.find()

  const projects = await query.populate("client", "-projects").select("-__v")

  res.send(projects)
})

router
  .route("/:id")
  .get(async function projectGetByIdHandler(req, res) {
    const { id } = req.params
    const project = await Project.findById({ _id: id })
    res.send(project)
  })

  .put(async function projectPutHandler(req, res) {
    const { id } = req.params
    const updateResponse = await Project.updateOne({ _id: id }, { ...req.body })
    res.send(updateResponse)
  })

  .delete(async function projectDeleteHandler(req, res) {
    const { id } = req.params
    const projects = await Project.deleteOne({ _id: id })
    res.send(projects)
  })

router.param("id", function projectRouterParamIdHandler(res, req, next, id) {
  next()
  console.log(`Project id is: ${id}`)
})

module.exports = router
