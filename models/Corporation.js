const mongoose = require("mongoose");

const schema = mongoose.Schema;

const corporateSchema = new mongoose.Schema({
  about: String,
  focusIndustries: [String],
  focusSectors: [String],
  preferredStages: [String],
});

const Corporate = mongoose.model("Corporate", corporateSchema);

module.exports = Corporate;
