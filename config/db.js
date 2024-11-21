const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/avioxSocial", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database is connected ");
  })
  .catch((err) => {
    console.log("Getting Error", err);
  });
