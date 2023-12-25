const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
 .then(()=>console.log("Database  Connected"))
 .catch((error)=> console.log(error));

 module.exports = mongoose;