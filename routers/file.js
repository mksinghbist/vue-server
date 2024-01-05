const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
router.use('/public', express.static(path.join(__dirname, 'public')));

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    // Save the file to the 'public' directory
    fs.writeFileSync(path.join(__dirname, 'public', 'products', originalname), buffer);
    res.status(200).json({ status: true, filename: originalname });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ status: false, error: 'Error uploading file' });
  }
});

router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'products', filename);
  if (fs.existsSync(filePath)) {
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).send('File not found');
  }
});

module.exports = router;
