const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
     productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    productTitle: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productQty: {
        type: Number,
        required: true
    },
    productImgUrl: {
        type: String,
        required: true
    },
    productDesc: {
        type: String
    },
    userEnterQty: {
        type: Number,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    name: String,
    userEmail: String,
    password: String,
    admin: Boolean,
    carts: [productSchema]
});
const usersInfo = mongoose.model('users',userSchema);

module.exports = usersInfo;