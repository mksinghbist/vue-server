const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("Database Connected"))
  .catch((error) => console.error(error));

module.exports = mongoose;
