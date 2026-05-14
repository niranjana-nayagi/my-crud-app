const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const itemController = require('../controllers/itemController');
const { protect, restrictTo } = require('../middleware/auth');

const itemValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 })
];

router.use(protect);

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItem);
router.post('/', restrictTo('admin', 'manager'), itemValidation, itemController.createItem);
router.put('/:id', restrictTo('admin', 'manager'), itemValidation, itemController.updateItem);
router.delete('/:id', restrictTo('admin'), itemController.deleteItem);

module.exports = router;