"use strict";
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');

const config = require('../config/firebase');


const validateProductDto = require('./DTO/product');
const jwtToken  = require('../midleware/authentication');
const productsInfo = require('../database/schema/products');

//Initialize a firebase application
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + '' + time;
  return dateTime;
}

router.use('/public', express.static(path.join(__dirname, 'public')));

router.post("/upload", upload.single("fileInput"), async (req, res) => {
  try {
      const dateTime = giveCurrentDateTime();

      const storageRef = ref(storage, `files/${req.file.originalname+dateTime}`);

      // Create file metadata including the content type
      const metadata = {
          contentType: req.file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);
      return res.status(200).json({
          status: true,
          message: 'file uploaded to firebase storage',
          name: req.file.originalname,
          type: req.file.mimetype,
          downloadURL: downloadURL})
  } catch (error) {
      return res.status(200).json({
        status: false,
        message: error.message
      })
  }
});

// router.get('/img/:filename', (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, 'public', 'products', filename);
//   if (fs.existsSync(filePath)) {
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   } else {
//     res.status(404).send('File not found');
//   }
// });

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
