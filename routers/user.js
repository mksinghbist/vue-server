// main.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../database/schema/users');

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
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', {
        expiresIn: '1h',
      });
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


module.exports = router;
