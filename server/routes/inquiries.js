const express = require("express")
const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} = require("../controllers/inquiryController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Public route
router.post("/", createInquiry)

// Protected admin routes
router.get("/", protect, authorize("admin"), getAllInquiries)
router.get("/:id", protect, authorize("admin"), getInquiryById)
router.put("/:id", protect, authorize("admin"), updateInquiry)
router.delete("/:id", protect, authorize("admin"), deleteInquiry)

module.exports = router
