const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected to the cluster.");
  })
  .catch((error) => {
    console.log(error);
  });
