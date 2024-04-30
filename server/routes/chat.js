const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat');

router.get('/:id', chatController.getChats);
router.get('/gatherMessages/:id/:userId', chatController.getChatMessagesFromId);
router.post('/createChat', chatController.createChat);

module.exports = router;