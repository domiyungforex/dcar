const mongoose = require("mongoose")

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a car title"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    brand: {
      type: String,
      required: [true, "Please provide a brand"],
    },
    year: {
      type: Number,
      required: [true, "Please provide a year"],
    },
    mileage: {
      type: Number,
      required: [true, "Please provide mileage"],
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Hybrid", "Electric"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    condition: {
      type: String,
      enum: ["New", "Used", "Certified Used"],
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["Available", "Sold", "Not Available"],
      default: "Available",
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Car", carSchema)
