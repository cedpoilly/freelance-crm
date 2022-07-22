export default function useHelpers() {
  return {
    formatDate,
    padStartNumber,
    replaceURLs,
    replaceURLsBase,
    isLastItem,
    replace,
    searchStringInList
  }
}

function padStartNumber(number) {
  return number.toString().padStart(2, "0")
}

function formatDate(timestampString) {
  const timestamp = parseInt(timestampString)

  let dateString = ""

  const date = new Date(timestamp)
  const isToday = new Date().getDate() - date.getDate() === 0
  const isYesterday = new Date().getDate() - date.getDate() === 1
  const isBefore = !isToday && !isYesterday

  const hours = padStartNumber(date.getHours())
  const minutes = padStartNumber(date.getMinutes())

  const day = padStartNumber(date.getDate())
  const month = padStartNumber(date.getMonth() + 1)

  dateString = isYesterday ? `yesterday` : dateString
  dateString = isToday ? `${hours}:${minutes}` : dateString
  dateString = isBefore ? `${day}/${month}` : dateString

  return dateString
}

function replaceURLs(message) {
  if (!message) return

  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
  return message.replace(urlRegex, function (url) {
    var hyperlink = url
    if (!hyperlink.match('^https?:\/\/')) {
      hyperlink = 'http://' + hyperlink
    }
    return '<a href="' + hyperlink + '" class="break-all font-medium underline text-sky-900 hover:font-bold" target="_blank" rel="noopener noreferrer">' + url + '</a>'
  })
}

function replaceURLsBase(message) {
  if (!message) return

  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
  return message.replace(urlRegex, function (url) {
    var hyperlink = url
    if (!hyperlink.match('^https?:\/\/')) {
      hyperlink = 'http://' + hyperlink
    }
    return '<a href="' + hyperlink + '" class="break-all text-yellow-50 dark:text-sky-600 font-medium underline hover:font-bold hover:text-sky-200" target="_blank" rel="noopener noreferrer">' + url + '</a>'
  })
}

function isLastItem(key, list) {
  const lastIndex = list.length - 1
  return lastIndex === key
}

function replace(string, text) {
  const parts = string.split("__")
  return `${parts[0]}${text}${parts[2]}`
}

function searchStringInList(list, searchString, options = { isObejectList: false }) {
  return [...list].filter(item => {
    const searchStringLowerCase = searchString.toLowerCase()
    const { isObejectList } = options

    if (isObejectList) {
      const values = Object.values(item)

      return !!values.some(value => isString(value) &&
        value.toLowerCase().includes(searchStringLowerCase)
      )
    }

    const lowerCaseItem = item.toLowerCase()
    return lowerCaseItem.includes(searchStringLowerCase)
  })

  function isString(input) {
    return !!input.includes && !!input.toLowerCase
  }
}