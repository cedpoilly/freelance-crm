const { default: mongoose, Mongoose, Schema } = require("mongoose")

const projectSchema = mongoose.Schema({
  title: { type: String, require: true, minLength: 5 },

  techs: [{
    type: String,
    enum: ["JavaScript", "HTML", "CSS", "Vue.js", "Front-End", "Back-end", "Node.js", "Express.js", "MongoDB", "Mongoose"]
  }],

  requirements: { type: String, require: true },

  milestones: [{ type: String, require: true }],

  isCodementor: { type: Boolean, require: true },

  paymentMethod: {
    type: String,
    require: true,
    enum: ["codementor", "bank", "paypal"]
  },

  budget: {
    type: Number,
    min: 20,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "budget_must_be_integer"
    }
  },

  hasDownPayment: { type: Boolean, require: true },

  wasPaymentDone: { type: Boolean, default: false },

  isCompleted: { type: Boolean, default: false },

  isInvoiceSent: { type: Boolean, default: false },

  wasPaidInFull: { type: Boolean, default: false },

  client: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Client"
  }
})

module.exports = mongoose.model("Project", projectSchema)