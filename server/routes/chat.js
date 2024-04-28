const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat');

router.get('/', chatController.getChats);
router.get('/:id', chatController.getChatFromId);
router.post('/createChat', chatController.createChat);

module.exports = router;