const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

const { clerkClient } = require('@clerk/clerk-sdk-node');

const db = require('../services/db');
const prepareDocument = require('../utils/prepare_document');
const { NewChatSchema, NewMessageSchema } = require('../schemas/chat');

exports.getChats = asyncHandler(async (req, res) => {
    const userId = req.body.user_id;

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

    const lastMessage = await db.collection('messages').find({ chat_id: chats._id }, { sort: { created_at: -1 }, limit: 1 }).toArray();

    if (lastMessage) {
        chat.lastMessage = lastMessage.message;
        chat.lastMessage.date = new Date(lastMessage.created_at).toDateString();
    }

    res.status(200).json({
        data: chats
    });
});

exports.getChatFromId = asyncHandler(async (req, res) => {
    const chatId = req.params.id;

    if (!chatId) {
        return res.status(400).json({
            message: 'Invalid chat ID'
        });
    }

    const chat = await db.collection('chats').findOne({ _id: chatId });

    if (!chat) {
        return res.status(500).json({
            message: 'Failed to get chat'
        });
    }

    chat.person = await clerkClient.users.getUser(chat.user_id);
    chat.person = {
        id: chat.person.id,
        firstName: chat.person.firstName,
        lastName: chat.person.lastName,
        fullName: chat.person.fullName
    }

    res.status(200).json({
        data: chat
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
    const chatExists = await db.collection('chats').findOne({ members: chat.members });

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