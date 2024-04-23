const express = require('express');
const asyncHandler = require('express-async-handler');

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