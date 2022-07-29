export default {
  firstName: {
    id: "firstName",
    name: "First Name",
    width: "w-9/24 md:w-7/24 lg:w-5/24 xl:w-4/24 truncate",
  },

  lastName: {
    id: "lastName",
    name: "Last Name",
    width: "w-9/24 md:w-7/24 lg:w-5/24 xl:w-4/24 truncate",
  },

  email: {
    id: "email",
    name: "Email",
    width: "lg:w-8/24 sm-hidden md-hidden lg-hidden truncate",
  },

  level: {
    id: "level",
    name: "Level",
    width: "lg:w-5/24 sm-hidden md-hidden truncate",
    formatter: cell => {
      const [first, ...rest] = cell.split("")
      return `${first.toUpperCase()}${rest.join("")}`
    },
  },

  serviceType: {
    id: "serviceType",
    name: "Service",
    width: "md:w-5/24 lg:w-4/24 sm-hidden truncate",
    formatter: cell => {
      const [first, ...rest] = cell.split("")
      return `${first.toUpperCase()}${rest.join("")}`
    },
  },

  rate: {
    id: "rate",
    name: "Rate (USD)",
    width: "w-6/24 md:w-5/24 lg:w-3/24 overflow-hidden ellipsis",
    formatter: rate => {
      return `$ ${rate}`
    },
  },

  isCodementor: {
    id: "isCodementor",
    name: "Code mentor",
    width: "sm-hidden md:w-5/24 lg:w-3/24 overflow-hidden ellipsis",
    formatter: isCodementor => {
      return isCodementor ? "Yes" : "No"
    },
  },

  tags: {
    id: "tags",
    name: "Tags",
    width: "2/12 !hidden",
    formatter: cell => {
      return cell.join(" | ")
    },
  },
}
