const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
    }
  ],
  totalQty: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 2,
  },
  ordersPaymentType : {
    type: String,
    default: 'cash',
  },
  ordersPaymentStatus : {
    type: Boolean,
    default: false,
  },
  orderStatus: {
    type: Boolean,
    default: false,
  }
});

const ordersInfo = mongoose.model('orders', userSchema);

module.exports = ordersInfo;
