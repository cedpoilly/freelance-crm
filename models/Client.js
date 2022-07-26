const { default: mongoose, Mongoose, Schema } = require("mongoose")

const Project = require("./Project")

const validateEmail = email => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

const clientSchema = mongoose.Schema({
  firstName: { type: String, require: true, minLength: 2 },

  lastName: { type: String, require: true, minLength: 2 },

  isCodementor: { type: Boolean, require: true },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true, // todo: required if NOT from Codementor
    validate: [validateEmail, "invalid_email"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "invalid_email"],
  },

  whatsAppNumber: {
    type: String,
    match:
      /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/,
    required: true, // todo: required if NOT from Codementor
  },

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },

  serviceType: {
    type: String,
    enum: ["individual", "team"],
  },

  rate: {
    type: Number,
    min: 20,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "rate_must_be_integer",
    },
  },

  tags: [
    {
      type: String,
      enum: [
        "JavaScript",
        "HTML",
        "CSS",
        "Vue.js",
        "Front-End",
        "Back-end",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Mongoose",
      ],
    },
  ],

  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
})

clientSchema.pre("remove", async function (next) {
  try {
    await Project.remove({
      _id: this.projects,
    })
    next()
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model("Client", clientSchema)
