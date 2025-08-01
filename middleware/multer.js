const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

function setupMulter(folder) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: folder,
        allowed_formats: ["jpg", "jpeg", "png"],
        public_id: file.originalname.split('.')[0] + '-' + Date.now(),
      };
    },
  });

  return multer({ storage });
}

module.exports = setupMulter