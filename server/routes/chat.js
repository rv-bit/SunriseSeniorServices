const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat');

router.get('/:id', chatController.getChats);
router.get('/gatherMessages/:id/:userId', chatController.getChatMessagesFromId);
router.get('/possibleMembers/:userId/:chatId', chatController.getPossibleMembers);
router.post('/createChat', chatController.createChat);
router.delete('/delete/:id', chatController.deleteChat);

module.exports = router;