const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

const { clerkClient } = require('@clerk/clerk-sdk-node');

const db = require('../services/db');
const { socketIO } = require('../services/socket');

const prepareDocument = require('../utils/prepare_document');
const { formatDate } = require('../utils/utils');

const { NewChatSchema, NewMessageSchema } = require('../schemas/chat');

socketIO.on('connection', (socket) => {
    socket.on('connectChat', (data) => {
        const chatId = data.chat_id;
        const members = data.members;

        console.log(`⚡: ${socket.id} user just connected! Chat ID: ${chatId} Members: ${members}`);
        socket.join(chatId);
    });

    socket.on('sendMessage', async (data) => {
        const message = {
            chat_id: data.chat_id,
            sender_id: data.sender_id,
            message: data.message
        }
        console.log(`🚀: ${socket.id} user just sent a message! Chat ID: ${message.chat_id} Sender ID: ${message.sender_id} Message: ${message.message}`);
        const messageDocument = await saveMessage(message);

        socketIO.to(message.chat_id).emit('receiveMessage', messageDocument);
    });

    socket.on('disconnectChat', (chatId) => {
        console.log(`🔥: ${socket.id} user just disconnected! Chat ID: ${chatId}`);
        socket.leave(chatId);
    })

    socket.on('disconnect', () => {
        console.log(`🔥: ${socket.id} user just disconnected!`);
        socket.disconnect();
    });
});

const saveMessage = async (message) => {
    const _id = crypto.randomBytes(16).toString('hex');

    const formatedDate = formatDate(new Date());
    const newMessage = {
        _id: _id,
        chat_id: message.chat_id,
        sender_id: message.sender_id,
        message: message.message,
        created_at: formatedDate
    }

    const messageDocument = prepareDocument(NewMessageSchema, newMessage);
    const result = await db.collection('messages').insertOne(messageDocument);

    if (!result) {
        return res.status(500).json({
            message: 'Failed to send message'
        });
    }

    if (result) {
        let senderInformation;

        try {
            senderInformation = await clerkClient.users.getUser(message.sender_id);
        } catch (error) {
            console.log(error);
        }

        if (senderInformation) {
            messageDocument.sender = {
                id: senderInformation.id,
                firstName: senderInformation.firstName,
                lastName: senderInformation.lastName,
                fullName: senderInformation.fullName
            }
        }
    }

    return messageDocument;
}

const membersInformation = async (members) => {
    let membersInformation = [];

    for (let i = 0; i < members.length; i++) {
        let memberInformation;
        try {
            memberInformation = await clerkClient.users.getUser(members[i]);
        } catch (error) {
            console.log(error);
        }

        if (memberInformation) {
            membersInformation.push({
                id: memberInformation.id,
                firstName: memberInformation.firstName,
                lastName: memberInformation.lastName,
                fullName: memberInformation.fullName
            });
        }
    }

    return membersInformation;
}

exports.getChats = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({
            message: 'Invalid user ID'
        });
    }

    const chats = await db.collection('chats').find({ members: userId }).toArray();

    if (!chats) {
        return res.status(500).json({
            message: 'Failed to get chats'
        });
    }

    for (let i = 0; i < chats.length; i++) {
        const lastMessage = await db.collection('messages').find({ chat_id: chats[i]._id }, { sort: { created_at: -1 }, limit: 1 }).toArray();

        if (lastMessage && lastMessage.length > 0) {
            chats[i].last_message = lastMessage[0].message
            chats[i].last_message_date = lastMessage[0].created_at
        }

        const infoMembers = await membersInformation(chats[i].members);
        chats[i].members = infoMembers;
    }

    res.status(200).json({
        data: chats
    });
});

exports.getChatMessagesFromId = asyncHandler(async (req, res) => {
    const chatId = req.params.id;
    const userId = req.params.userId;

    if (!chatId) {
        return res.status(400).json({
            message: 'Invalid chat ID'
        });
    }

    const messages = await db.collection('messages').find({ chat_id: chatId }).toArray();

    if (!messages) {
        return res.status(500).json({
            message: 'Failed to get messages'
        });
    }

    const sender = messages.find(message => message.sender_id !== userId);
    let senderInformation;
    try {
        senderInformation = await clerkClient.users.getUser(sender.sender_id);
    } catch (error) {
        console.log(error);
    }

    for (let i = 0; i < messages.length; i++) {
        messages[i].sender = {
            id: senderInformation.id,
            firstName: senderInformation.firstName,
            lastName: senderInformation.lastName,
            fullName: senderInformation.fullName
        }
    }

    res.status(200).json({
        data: messages
    });
});

exports.createChat = asyncHandler(async (req, res) => {
    const chat = req.body.data;

    if (!chat) {
        return res.status(400).json({
            message: 'Invalid chat'
        });
    }

    const _id = crypto.randomBytes(16).toString('hex');
    const newChat = {
        _id: _id,
        members: chat.members,
        name: chat.name,
        created_at: new Date().toDateString()
    }

    const chatDocument = prepareDocument(NewChatSchema, newChat);

    const chatExists = await db.collection('chats').findOne({ name: chat.name, members: chat.members });

    if (chatExists) {
        return res.status(200).json({
            message: 'Chat already exists'
        });
    }

    const result = await db.collection('chats').insertOne(chatDocument);

    if (!result) {
        return res.status(500).json({
            message: 'Failed to create chat'
        });
    }

    res.status(200).json({
        data: chatDocument
    });
});