import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "default",
  endpoint: process.env.LIARA_ENDPOINT?.startsWith("http")
    ? process.env.LIARA_ENDPOINT
    : `https://${process.env.LIARA_ENDPOINT}`, // مطمئن شو پروتکل هست
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
  forcePathStyle: true,
});

export const uploadToS3 = async (file, key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3.send(command);

  return key;
};

export const deleteFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);
};
