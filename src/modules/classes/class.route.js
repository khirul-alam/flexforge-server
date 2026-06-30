const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');
const checkBlocked = require('../../middlewares/checkBlocked');
const {
  getAllClasses,
  getAllClassesForAdmin,
  getFeaturedClasses,
  getClassById,
  createClass,
  getClassesByTrainer,
  updateClass,
  deleteClass,
  updateClassStatus,
} = require('./class.controller');

const router = express.Router();

router.get('/', getAllClasses); // Public
router.get('/all', verifyToken, verifyRole(['admin']), getAllClassesForAdmin); // Admin
router.get('/featured', getFeaturedClasses); // Public
router.get('/trainer/:email', verifyToken, verifyRole(['trainer']), getClassesByTrainer);
router.get('/:id', verifyToken, getClassById); // Private
router.post('/', verifyToken, verifyRole(['trainer']), checkBlocked, createClass);
router.patch('/:id', verifyToken, verifyRole(['trainer']), updateClass);
router.delete('/:id', verifyToken, verifyRole(['trainer', 'admin']), deleteClass);
router.patch('/status/:id', verifyToken, verifyRole(['admin']), updateClassStatus);

module.exports = router;