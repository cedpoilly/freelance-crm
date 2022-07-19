const express = require("express")
const router = express.Router()

const Project = require("../models/Project")

router.post("/", async function projectPostHandler(req, res) {
  const projectDocument = new Project({ ...req.body })
  try {
    const createdProject = await projectDocument.save()
    res.send(createdProject)
  }
  catch (error) {
    console.error(error.message)
    res.send(error.message)
  }
})

router.get("/", async function getAllProjectsHandler(req, res) {
  const projects = await Project.find().populate("client")
  res.send(projects)
})

router.route("/:id")
  .get(async function projectGetByIdHandler(req, res) {
    const { id } = req.params
    const projects = await Project.findById({ _id: id })
    res.send(projects)
  })

  .put(async function projectPutHandler(req, res) {
    const { id } = req.params
    const projects = await Project.updateOne({ id })
    res.send(projects)
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