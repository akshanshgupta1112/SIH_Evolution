const mongoose = require("mongoose");

const schema = mongoose.Schema;

const incubatorSchema = new mongoose.Schema({
  about: String,
  focusIndustries: [String],
  focusSectors: [String],
  prefStartupStages: [String],
  programDuration: Number,
  location: String,
  yearEstablised: Number,
  ratings: Number,
  currentIncubates: Number,
  graduateIncubates: Number,
  website: String,
});

const Incubator = mongoose.model("Incubator", incubatorSchema);

module.exports = Incubator;
