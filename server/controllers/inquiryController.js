const Inquiry = require("../models/Inquiry")
const Car = require("../models/Car")

// Create new inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { carId, name, email, phone, message } = req.body

    if (!carId || !name || !email || !phone || !message) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Verify car exists
    const car = await Car.findById(carId)
    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    const inquiry = await Inquiry.create({
      carId,
      name,
      email,
      phone,
      message,
    })

    res.status(201).json({
      success: true,
      data: inquiry,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all inquiries (admin only)
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate("carId", "title brand year price").sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get inquiry by ID (admin only)
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate("carId")

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" })
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update inquiry status (admin only)
exports.updateInquiry = async (req, res) => {
  try {
    const { status } = req.body

    let inquiry = await Inquiry.findById(req.params.id)

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" })
    }

    inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).json({
      success: true,
      data: inquiry,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete inquiry (admin only)
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" })
    }

    await Inquiry.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
