const baseURL = import.meta.env.VITE_BASE_URL

import { getConfig, stripItemId } from "./config"

export async function getClients() {
  return fetch(`${baseURL}/clients/`)
}

export async function getClientById(clientId) {
  return fetch(`${baseURL}/clients/${clientId}`)
}

export async function createClient(client) {
  const url = `${baseURL}/clients/`

  const response = await fetch(
    url,
    getConfig(client, "POST")
  )

  return await response.json()
}

export async function updateClient(client) {
  const url = `${baseURL}/clients/${client._id}`

  const strippedClient = stripItemId(client)

  const response = await fetch(
    url,
    getConfig(strippedClient, "PUT")
  )

  return await response.json()
}