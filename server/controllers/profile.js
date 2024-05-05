const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

const { clerkClient } = require('@clerk/clerk-sdk-node');

exports.getProfile = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const user = await clerkClient.users.getUser(id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
});