const cloudinary = require('cloudinary').v2;

function connectToCloudinary() {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
    console.log("Cloudinary running on cloud:", cloudinary.config().cloud_name);
}


module.exports = connectToCloudinary
