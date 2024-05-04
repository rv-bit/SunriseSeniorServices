const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat');

router.get('/:id', chatController.getChats);
router.get('/gatherMessages/:id/:userId', chatController.getChatMessagesFromId);
router.get('/possibleMembers/:userId/:chatId', chatController.getPossibleMembers);

router.post('/createChat', chatController.createChat);
router.post('/addMember/:id', chatController.addMember);

router.delete('/delete/:id', chatController.deleteChat);
router.delete('/removeMember/:id', chatController.removeMember);

module.exports = router;