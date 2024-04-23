const express = require('express');
const { crypto } = require('crypto');
const asyncHandler = require('express-async-handler');

// const db = require('../services/db');

exports.getJobListings = asyncHandler(async (req, res) => {
    res.json({
        message: 'GET job listings'
    });
});

exports.createJobListing = asyncHandler(async (req, res) => {
    res.json({
        message: 'POST job listing'
    });
});