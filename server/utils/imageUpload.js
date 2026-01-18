const cloudinary = require("../config/cloudinary")

const uploadToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `dcar/${filename}`,
        folder: "dcar/cars",
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      },
    )

    uploadStream.end(buffer)
  })
}

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}

module.exports = { uploadToCloudinary, deleteFromCloudinary }
