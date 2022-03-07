const mongoose = require("mongoose");

const schema = mongoose.Schema;

const startupSchema = new mongoose.Schema({
  about: {
    type: String,
  },

  stage: {
    type: String,
  },
  focusIndustry: {
    type: String,
  },

  focusSector: {
    type: String,
  },

  serviceAreas: [
    {
      type: String,
    },
  ],
  location: String,
  mentorsConnected: {
    type: [schema.Types.ObjectId],
    ref: "Mentor",
  },
});

const Startup = mongoose.model("Startup", startupSchema);

module.exports = Startup;
