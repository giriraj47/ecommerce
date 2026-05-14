const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Pass the local file path to this function
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "products", // Organizes images into a "products" folder in Cloudinary
      resource_type: "auto",
    });
    return result.secure_url; // This is the public URL you'll store in your DB
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = { uploadImage };
