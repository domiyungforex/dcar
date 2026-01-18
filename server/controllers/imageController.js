const Car = require("../models/Car")
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/imageUpload")

// Upload images for a car
exports.uploadCarImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please provide at least one image" })
    }

    const { id } = req.params

    // Verify car exists
    const car = await Car.findById(id)
    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    const uploadedImages = []

    // Upload each file to Cloudinary
    for (const file of req.files) {
      const timestamp = Date.now()
      const filename = `car-${id}-${timestamp}`

      const result = await uploadToCloudinary(file.buffer, filename)

      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      })
    }

    // Update car with new images
    car.images.push(...uploadedImages)
    await car.save()

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      images: uploadedImages,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete image from car
exports.deleteCarImage = async (req, res) => {
  try {
    const { id } = req.params
    const { publicId } = req.body

    if (!publicId) {
      return res.status(400).json({ message: "Please provide image publicId" })
    }

    // Delete from Cloudinary
    const deleted = await deleteFromCloudinary(publicId)
    if (!deleted) {
      return res.status(500).json({ message: "Failed to delete image from storage" })
    }

    // Update car document
    const car = await Car.findByIdAndUpdate(id, { $pull: { images: { publicId } } }, { new: true })

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: car,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
