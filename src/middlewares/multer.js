const multer = require("multer");
try {
  const storage = multer.memoryStorage();
  const uploadImages = multer({ storage });
  module.exports = uploadImages;
} catch (error) {
  throw error;
}
