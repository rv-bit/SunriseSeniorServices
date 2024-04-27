const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

const { clerkClient } = require('@clerk/clerk-sdk-node');

const db = require('../services/db');
const prepareDocument = require('../utils/prepare_document');
const { NewJobListingSchema } = require('../schemas/joblisting');

exports.getJobListings = asyncHandler(async (req, res) => {
    const jobListings = await db.collection('jobListings').find({}).toArray();

    if (!jobListings) {
        return res.status(500).json({
            message: 'Failed to get job listings'
        });
    }

    res.status(200).json({
        data: jobListings
    });
});

exports.getJobListingUserFromId = asyncHandler(async (req, res) => {
    const user = req.params.id;
    const clerkUser = await clerkClient.users.getUser(user);

    if (!clerkUser) {
        return res.status(500).json({
            message: 'Failed to get user'
        });
    }

    const userData = {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        fullName: clerkUser.fullName,
    }

    res.status(200).json({
        data: userData
    });

});

exports.createJobListing = asyncHandler(async (req, res) => {
    const data = req.body;
    const form = data.formData;

    const _id = crypto.randomBytes(16).toString('hex');
    const newJobListing = {
        _id: _id,
        user_id: form.user_id,

        title: form.title,
        description: form.description,
        category: form.options.category[0],

        additional_information: form.additional_information,
        payment_type: form.options.payment_type[0],
        payment_amount: parseInt(form.payment),
        start_date: form.start_date,
        days: form.days,
        hours: parseInt(form.work_hours),
        posted_at: new Date().toDateString()
    }

    const document = prepareDocument(NewJobListingSchema, newJobListing);
    const jobListingInsert = await db.collection('jobListings').insertOne(document)

    if (!jobListingInsert) {
        return res.status(500).json({
            message: 'Failed to create job listing'
        });
    }

    res.json({
        message: 'POST job listing'
    });
});