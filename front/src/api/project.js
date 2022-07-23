export async function persistProject(project) {
  const url = `http://localhost:3000/projects/${project._id}`
  project._id = null
  project = Object.entries(project).reduce((acc, current) => {
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
      body: JSON.stringify(project)
    })
  return await response.json()
}