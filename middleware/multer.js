const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

function setupMulter() {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "book-covers",
      allowed_formats: ["jpg", "jpeg", "png"]
    },
  });

  return multer({ storage });
}

module.exports = setupMulter;
