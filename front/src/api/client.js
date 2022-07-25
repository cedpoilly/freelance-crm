const baseURL = import.meta.env.VITE_BASE_URL

export async function getClients() {
  return fetch(`${baseURL}/clients/`)
}

export async function persistClient(client) {
  const url = `${baseURL}/clients/${client._id}`
  client._id = null
  client = Object.entries(client).reduce((acc, current) => {
    const isId = current[0] === "_id"
    if (isId) { return acc }
    return acc = { ...acc, [current[0]]: current[1] }
  }, {})

  const response = await fetch(
    url,
    {
      method: "PUT",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(client)
    })
  return await response.json()
}