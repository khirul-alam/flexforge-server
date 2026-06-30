const express = require('express');
const { issueJWT, logout } = require('./auth.controller');

const router = express.Router();

router.post('/jwt', issueJWT);
router.post('/logout', logout);

module.exports = router;