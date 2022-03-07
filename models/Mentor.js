const mongoose = require("mongoose");

const schema = mongoose.Schema;

const mentorSchema = new mongoose.Schema({
  about: {
    type: String,
  },

  focusIndustries: [
    {
      type: String,
    },
  ],

  focusSectors: [
    {
      type: String,
    },
  ],

  startupStages: [
    {
      type: String,
    },
  ],

  startupMentored: {
    type: Number,
  },

  guidanceAreas: [
    {
      type: String,
    },
  ],

  ratings: {
    type: Number,
  },

  programs: {
    type: [schema.Types.ObjectId],
    ref: "Program",
  },

  startupsConnections: {
    type: [schema.Types.ObjectId],
    ref: "Startup",
  },
});

const Mentor = mongoose.model("Mentor", mentorSchema);

module.exports = Mentor;
