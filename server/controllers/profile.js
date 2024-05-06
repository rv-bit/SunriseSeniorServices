const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

const { clerkClient } = require('@clerk/clerk-sdk-node');

const db = require('../services/db');

exports.getProfile = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const userId = 'user_' + id;

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const userAdditionalData = await db.collection('users').findOne({ _id: userId });

    if (!userAdditionalData) {
        return res.status(404).json({ message: 'User additional data not found' });
    }

    const filteredUserAdditionalData = {}
    for (const key in userAdditionalData) {
        if (key === '_id' || key === 'user_id') continue;
        filteredUserAdditionalData[key] = userAdditionalData[key];
    }

    user.additionalData = filteredUserAdditionalData

    res.status(200).json(user);
});