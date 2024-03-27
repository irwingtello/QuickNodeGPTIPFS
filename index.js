require("dotenv").config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const FormData = require('form-data');
const QUICKNODE_API_KEY = process.env.QUICKNODE_API_KEY;
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// API endpoint for uploading files
app.post('/api/uploadFile', async (req, res) => {
  try {
    //Content Type - image/jpeg - application/pdf - image/png
    const { base64Content, filename, contentType } = req.body;
    const buffer = Buffer.from(base64Content, 'base64');
    const formData = new FormData();
    formData.append('Body', buffer, { contentType: contentType, filename: filename });
    formData.append('Key', filename);
    formData.append('ContentType',"image/png");
    
    const response = await axios.post(
      'https://api.quicknode.com/ipfs/rest/v1/s3/put-object',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': QUICKNODE_API_KEY
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred while uploading file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
