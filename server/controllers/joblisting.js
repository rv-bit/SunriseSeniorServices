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

exports.getJobListingsFromId = asyncHandler(async (req, res) => {
    console.log(req.params);

    const jobId = req.params.id;
    const jobListing = await db.collection('jobListings').findOne({ _id: jobId });

    if (!jobListing) {
        return res.status(500).json({
            message: 'Failed to get job listing'
        });
    }

    jobListing.person = await clerkClient.users.getUser(jobListing.user_id);
    jobListing.person = {
        id: jobListing.person.id,
        firstName: jobListing.person.firstName,
        lastName: jobListing.person.lastName,
        fullName: jobListing.person.fullName
    }

    res.status(200).json({
        data: jobListing
    });
});

exports.getJobListingUserFromId = asyncHandler(async (req, res) => {
    const user = req.params.id;
    let clerkUser;

    try {
        clerkUser = await clerkClient.users.getUser(user);
    } catch (error) {
        const deleteListing = await db.collection('jobListings').deleteOne({
            user_id: user
        });

        if (!deleteListing) {
            return res.status(500).json({
                message: 'Failed to delete job listing'
            });
        }

        return res.status(400).json({
            error: 'UserNotFound'
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