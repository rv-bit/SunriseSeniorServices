const express = require('express');
const asyncHandler = require('express-async-handler');

const { ObjectId } = require('mongodb');
const db = require('../services/db');

exports.getUser = asyncHandler(async (req, res) => {
    const user = await req.params.id;

    const data = await db.collection('users').findOneAndUpdate(
        { _id: user },
        { $setOnInsert: { _id: user } },
        { upsert: true, returnDocument: 'after' }
    );

    if (!data) {
        return res.status(400).json({
            Error: 'Error updating user data'
        });
    }

    res.status(200).json({
        data: data
    });
});

exports.update = asyncHandler(async (req, res) => {
    const { user, data } = await req.body;

    if (!user || !data) {
        res.status(400).json({
            Error: 'Missing user or data'
        });
    }

    const dataUpdated = await db.collection('users').findOneAndUpdate(
        { _id: user },
        { $set: data },
        { upsert: true, returnDocument: 'after' }
    );

    if (!dataUpdated) {
        return res.status(400).json({
            Error: 'Error updating user data'
        });
    }

    res.status(200).json({
        data: dataUpdated
    });
});