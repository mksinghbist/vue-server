const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    productName: {
        type : String,
        required: true,
    },
    productImgUrl: {
        type : String,
        required: true,
    },
    productQty: {
        type : Number,
        default : 0,
    },
    productMaxQty: {
        type : Number,
        default : 2,
    },
    productMinQty: {
        type : Number,
        default : 1,
    },
    productSoldQty: {
        type : Number,
        default : 0,
    },
    productDescription : {
        type : String,
        default : '',
    },
    productStatus: {
        type : Boolean,
        default : false,
    }
});
const productsInfo = mongoose.model('products',userSchema);

module.exports = productsInfo;