const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');
const {
  createUser,
  getAllUsers,
  getUserByEmail,
  blockUser,
  unblockUser,
  makeAdmin,
  demoteToUser,
} = require('./user.controller');

const router = express.Router();

router.post('/', createUser); // Public - registration
router.get('/:email', verifyToken, getUserByEmail); // Authenticated user checks own role
router.get('/', verifyToken, verifyRole(['admin']), getAllUsers);
router.patch('/block/:id', verifyToken, verifyRole(['admin']), blockUser);
router.patch('/unblock/:id', verifyToken, verifyRole(['admin']), unblockUser);
router.patch('/make-admin/:id', verifyToken, verifyRole(['admin']), makeAdmin);
router.patch('/demote/:id', verifyToken, verifyRole(['admin']), demoteToUser);

module.exports = router;