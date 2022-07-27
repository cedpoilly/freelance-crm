export default {
  title: {
    id: "title",
    name: "Title",
    width: "sm:w-7/12",
  },

  paymentMethod: {
    id: "paymentMethod",
    name: "Payment Methods",
    width: "w-3/12 md-hidden",
    formatter: cell => {
      const [first, ...rest] = cell.split("")
      return `${first.toUpperCase()}${rest.join("")}`
    },
  },

  budget: {
    id: "budget",
    name: "Budget",
    width: "w-2/12",
  },

  isCompleted: {
    id: "isCompleted",
    name: "Done?",
    width: "w-2/12",
    formatter: isCodementor => {
      return isCodementor ? "Yes" : "No"
    },
  },

  wasPaymentDone: {
    id: "wasPaymentDone",
    name: "Paid?",
    width: "sm-hidden md-hidden lg-hidden",
    formatter: isCodementor => {
      return isCodementor ? "Yes" : "No"
    },
  },

  hasDownPayment: {
    id: "hasDownPayment",
    name: "50% up?",
    width: "md:w-2/12 sm-hidden md-hidden lg-hidden xl-hidden",
    formatter: isCodementor => {
      return isCodementor ? "Yes" : "No"
    },
  },

  client: {
    id: "client",
    name: "Client",
    width: "lg:w-6/12 xl:w-5/12 md-hidden lg-hidden",
    formatter: client => {
      return `${client?.firstName} ${client?.lastName}` || "<no client 🤷>"
    },
  },
}
