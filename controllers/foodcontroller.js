const Food = require('../models/foodmodels');

exports.createFoodItem = async (req, res) => {
    const { name, price } = req.body;
    try {
      const newFoodItem = new Food({
        name,
        price,
        availability: true, 
      });
      const savedFoodItem = await newFoodItem.save();
      res.status(201).json(savedFoodItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.deletefood = async(req, res) =>{
  try {
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({ error: "Food ID is required" });
    }
    const deletedfood = await Food.findByIdAndDelete(foodId);
    if (!deletedfood) {
      return res.status(404).json({ error: "Food not found" });
    }
    res.status(200).json({ message: "Food deleted successfully", deletedfood });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Food" });
  }
}

exports.updateFoodAvailability = async (req, res) => {
    const { foodId } = req.body;
    const { availability } = req.body;
    try {
      const updatedFoodItem = await Food.findByIdAndUpdate(
        foodId,
        { availability },
        { new: true }
      );
      if (!updatedFoodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }
      res.json(updatedFoodItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
exports.fetchmenu = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json({ foods });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
};









