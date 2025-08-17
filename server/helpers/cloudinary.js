const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

// Accept only image types and enforce size in multer to avoid long uploads/timeouts
const fileFilter = (req, file, cb) => {
  try {
    const ok = /image\/(png|jpe?g|webp)/i.test(file.mimetype);
    if (ok) return cb(null, true);
    return cb(new Error("Invalid file type. Only PNG, JPG, JPEG, WEBP are allowed."));
  } catch (e) {
    return cb(new Error("Invalid file upload."));
  }
};

async function imageUploadUtil(fileOrBuffer) {
  if (Buffer.isBuffer(fileOrBuffer)) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(fileOrBuffer);
    });
  }

  // Fallback for data URLs or remote URLs
  const result = await cloudinary.uploader.upload(fileOrBuffer, {
    resource_type: "image",
  });
  return result;
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

module.exports = { upload, imageUploadUtil };
