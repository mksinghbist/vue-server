"use strict";
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const validateProductDto = require('./DTO/product');
const jwtToken  = require('../midleware/authentication');
const productsInfo = require('../database/schema/products');


router.use('/public', express.static(path.join(__dirname, 'public')));

router.post('/upload', jwtToken.verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    fs.writeFileSync(path.join(__dirname, 'public', 'products', originalname), buffer);
    res.status(200).json({ status: true, filename: originalname });
  } catch (error) {
    res.status(500).json({ status: false, error: 'Error uploading file' });
  }
});

router.get('/img/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'products', filename);
  if (fs.existsSync(filePath)) {
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).send('File not found');
  }
});

router.post('/add', jwtToken.verifyToken, async (req, res) => {
  const rawData = req.body;
  try {
    rawData.userId = req.user.userId;
    const newProduct = validateProductDto(rawData);
    if (!newProduct) {
      return res.status(500).json({ error: 'Invalid data format' });
    }
    const response = await newProduct.save();
  
    return res.status(200).json({ message: 'Product added successfully', status: true, data: response });
  } catch (error) {
    return res.status(500).json({ message: error, status: false });
  }  
});

router.get('/list', jwtToken.verifyToken, async(req, res) => {
  try {
    var userId = req.user.userId;
    const productListResponse = await productsInfo.find({userId : new mongoose.Types.ObjectId(userId.trim()) });
    res.status(200).json({status : true, productList: productListResponse});
  } catch (error) {
    res.status(500).json({status : false, message:  error });
  }
});

module.exports = router;
