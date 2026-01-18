const express = require("express")
const upload = require("../middleware/upload")
const { uploadCarImages, deleteCarImage } = require("../controllers/imageController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Protected admin routes for image upload
router.post("/:id", protect, authorize("admin"), upload.array("images", 10), uploadCarImages)
router.delete("/:id", protect, authorize("admin"), deleteCarImage)

module.exports = router
