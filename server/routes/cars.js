const express = require("express")
const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getFeaturedCars,
} = require("../controllers/carController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Public routes
router.get("/featured", getFeaturedCars)
router.get("/", getAllCars)
router.get("/:id", getCarById)

// Protected admin routes
router.post("/", protect, authorize("admin"), createCar)
router.put("/:id", protect, authorize("admin"), updateCar)
router.delete("/:id", protect, authorize("admin"), deleteCar)

module.exports = router
