// main.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const users = require('../database/schema/users');
const jwtToken = require('../midleware/authentication');
const productsInfo = require('../database/schema/products');

router.post('/login', async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    const user = await users.findOne({ userEmail });
    var dataResponse = {
      status : false,
      msg: '',
      token: ''
    };
    if (!user || !(await bcrypt.compare(password, user.password))) {
      dataResponse.status = false;
      dataResponse.msg = 'Invalid username or password'
    } else {
      const userInfo = {
        userId : user._id,
        userName:user.name,
        userEmail: user.userEmail,
        userAdmin: user.admin,
      }      
      const token = jwtToken.generateToken(userInfo);
      dataResponse.status = true;
      dataResponse.msg = 'Login Successfull';
      dataResponse.token = token;
      dataResponse.admin = user.admin ? user.admin : false;
    }
    res.status(200).json(dataResponse);
  } catch(error) {
    res.status(500).json({status : false , msg : error});
  }
});
router.post('/signup', async (req, res) => {
    try {
      const { userName, userEmail, userPassword} = req.body;
      const user = await users.findOne({ userEmail });
      const dataResponse = {}
      if(!user) {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const newUser = new users({ name : userName,userEmail,password: hashedPassword, admin: false });
        const response = await newUser.save();
        dataResponse.status = true;
        dataResponse.user = response;
        res.status(200).json(dataResponse);
      } else {
        res.status(201).json({status : false , msg : 'user already exit'});
      }
    } catch(error) {
      res.status(500).json({status : false , msg : error});
    };
});
router.get('/users', async (req, res) => { 
  const user = await users.find({});
  res.status(200).json({users : user});
});
router.get('/user/product/list',jwtToken.verifyToken, async (req,res) => {
  try {
    const productList = await productsInfo.find({});
    const productListResponse = productList.map(product => {
      return {
          productId: product._id,
          productTitle: product.productTitle,
          productPrice: product.productPrice,
          productQty: product.productQty,
          productImgUrl: product.productImgUrl,
          productDesc: product.productDescription,
        };
    });
    res.status(200).json({status : true, productList: productListResponse});
  } catch (error) {
    res.status(500).json({status : false, message:  error });
  }
})
module.exports = router;
