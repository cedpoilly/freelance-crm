import useHelpers from "../app/helpers"

const { getCopy } = useHelpers()

export function getConfig(data, method = "POST") {
  return {
    method: method,

    mode: 'cors',

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(data)
  }
}

export function stripItemId(originalItem) {
  let item = getCopy(originalItem)

  item._id = null

  item = Object.entries(item).reduce((acc, current) => {
    const isId = current[0] === "_id"
    if (isId) { return acc }
    return acc = { ...acc, [current[0]]: current[1] }
  }, {})

  return item
}