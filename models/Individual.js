const mongoose = require("mongoose");

const individualSchema = new mongoose.Schema({
  interest: {
    type: String,
    required: true,
  },
  location: String,
  connections: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

const Individual = mongoose.model("Individual", individualSchema);

module.exports = Individual;
