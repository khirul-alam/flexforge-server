const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');
const checkBlocked = require('../../middlewares/checkBlocked');
const {
  applyAsTrainer,
  getAllApplications,
  approveApplication,
  rejectApplication,
} = require('./application.controller');

const router = express.Router();

router.post('/', verifyToken, checkBlocked, applyAsTrainer);
router.get('/', verifyToken, verifyRole(['admin']), getAllApplications);
router.patch('/approve/:id', verifyToken, verifyRole(['admin']), approveApplication);
router.patch('/reject/:id', verifyToken, verifyRole(['admin']), rejectApplication);

module.exports = router;