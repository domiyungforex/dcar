const Car = require("../models/Car")

// Get all cars with filters
exports.getAllCars = async (req, res) => {
  try {
    const { brand, year, minPrice, maxPrice, condition } = req.query

    const filter = { status: "Available" }

    if (brand) filter.brand = brand
    if (year) filter.year = Number.parseInt(year)
    if (condition) filter.condition = condition
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number.parseInt(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseInt(maxPrice)
    }

    const cars = await Car.find(filter).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    res.status(200).json({
      success: true,
      data: car,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create new car (admin only)
exports.createCar = async (req, res) => {
  try {
    const { title, price, brand, year, mileage, fuelType, transmission, condition, description } = req.body

    if (!title || !price || !brand || !year || !mileage || !fuelType || !transmission || !condition) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    const car = await Car.create({
      title,
      price,
      brand,
      year,
      mileage,
      fuelType,
      transmission,
      condition,
      description,
      images: [],
    })

    res.status(201).json({
      success: true,
      data: car,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update car (admin only)
exports.updateCar = async (req, res) => {
  try {
    let car = await Car.findById(req.params.id)

    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: car,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete car (admin only)
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)

    if (!car) {
      return res.status(404).json({ message: "Car not found" })
    }

    await Car.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get featured cars (home page)
exports.getFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.find({ status: "Available" }).limit(6).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: cars,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
