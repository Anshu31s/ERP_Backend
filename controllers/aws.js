import AWS from 'aws-sdk';
import fs from 'fs'; 
import dotenv from 'dotenv';
dotenv.config();


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: 'us-east-1' 
});

// Create S3 instance
const s3 = new AWS.S3();

// Upload function
const uploadImage = (filePath, bucketName, keyName) => {
  const fileContent = fs.readFileSync(filePath);

  
  const params = {
    Bucket: bucketName,
    Key: keyName, // Name of the file in the bucket
    Body: fileContent,
    ContentType: 'image/jpeg', // Adjust for your file type
    ACL: 'public-read' // Make it publicly accessible
  };

  return s3.upload(params).promise();
};

// Usage example
const filePath = 'path/to/your/image.jpg';
const bucketName = 'your-bucket-name';
const keyName = 'uploads/image.jpg'; 

uploadImage(filePath, bucketName, keyName)
  .then(data => {
    console.log(`File uploaded successfully. URL: ${data.Location}`);
  })
  .catch(error => {
    console.error('Error uploading file:', error);
  });
