import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadDocumentToS3 = async (req, res, next) => {
  const documentMetaData = req.file;

  if (!documentMetaData) {
    return res.json({
      success: false,
      message: "Please upload Document",
      data: [],
    });
  }

  const filePath = path.resolve(documentMetaData.path);

  const fileStream = fs.createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: "erpmodel",
    Key: `avatars/${documentMetaData.filename}`,
    Body: fileStream,
    ContentType: documentMetaData?.mimetype,
  });

  try {
    const response = await client.send(command);
    fs.unlink(filePath, (err) => {
      if (err) {
        return;
      }
    });
    const documentUrl = `https://erpmodel.s3.us-east-1.amazonaws.com/avatars/${documentMetaData.filename}`;
    req.body.documentUrl = documentUrl;
    
    next();
  } catch (err) {
    res.json({
      success: false,
      message: "Error uploading document",
      data: [],
    });
    console.error(err);
  }
};
