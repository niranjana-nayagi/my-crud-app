const Item = require('../models/Item');
const { validationResult } = require('express-validator');

// GET all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('createdBy', 'name email');
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch items.' });
  }
};

// GET one item by ID
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch item.' });
  }
};

// POST create a new item
exports.createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const item = await Item.create({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user._id  // set from the protect middleware
    });
    res.status(201).json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Could not create item.' });
  }
};

// PUT update an item
exports.updateItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description },
      { new: true, runValidators: true }  // new:true returns the updated doc
    );
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Could not update item.' });
  }
};

// DELETE an item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete item.' });
  }
};