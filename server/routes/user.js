const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/:id', userController.getUser);
router.post('/update', userController.update);

module.exports = router;