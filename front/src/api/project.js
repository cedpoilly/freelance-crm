const baseURL = import.meta.env.VITE_BASE_URL

import { getConfig, stripItemId } from "./config"

export async function getProjects() {
  return fetch(`${baseURL}/projects/`)
}

export async function getProjectsByClientId(clientId) {
  return fetch(`${baseURL}/projects/${clientId}`)
}

export async function createProject(project) {
  const url = `${baseURL}/projects/`

  const response = await fetch(
    url,
    getConfig(project, "POST")
  )

  return await response.json()
}

export async function updateProject(project) {
  const url = `${baseURL}/projects/${project._id}`

  const strippedClient = stripItemId(project)

  const response = await fetch(
    url,
    getConfig(strippedClient, "PUT")
  )

  return await response.json()
}