const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    userEmail: String,
    password: String,
    admin: Boolean,
});
const usersInfo = mongoose.model('users',userSchema);

module.exports = usersInfo;