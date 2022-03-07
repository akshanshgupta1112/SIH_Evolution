const mongoose = require("mongoose");

const schema = mongoose.Schema;

const requestSchema = new mongoose.Schema({
  resolved: {
    type: Boolean,
    required: true,
  },
  sendTo: {
    type: schema.Types.ObjectId,
  },
  sendFrom: {
    type: schema.Types.ObjectId,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
