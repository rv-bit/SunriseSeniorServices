const express = require('express');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

const { clerkClient } = require('@clerk/clerk-sdk-node');

const db = require('../services/db');
const prepareDocument = require('../utils/prepare_document');
const { formatDate } = require('../utils/utils');

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

exports.getJobListingsByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const jobListings = await db.collection('jobListings').find({ user_id: userId }).toArray();

    if (!jobListings) {
        return res.status(500).json({
            message: 'Failed to get job listings'
        });
    }

    res.status(200).json({
        data: jobListings
    });
});

exports.getJobListingsFromJobId = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const jobListing = await db.collection('jobListings').findOne({ _id: jobId });

    if (!jobListing) {
        return res.status(500).json({
            message: 'Failed to get job listing'
        });
    }

    let clerkUser;
    try {
        clerkUser = await clerkClient.users.getUser(jobListing.user_id);
    } catch (error) {
        const deleteListing = await db.collection('jobListings').deleteOne({
            _id: jobId
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

    jobListing.person = {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        fullName: clerkUser.fullName,
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
    const formatedDate = formatDate(new Date());
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
        location: form.location || 'N/A',
        posted_at: formatedDate
    }

    const document = prepareDocument(NewJobListingSchema, newJobListing);
    const jobListingInsert = await db.collection('jobListings').insertOne(document)

    if (!jobListingInsert) {
        return res.status(500).json({
            message: 'Failed to create job listing'
        });
    }

    res.status(200).json({
        message: 'POST job listing'
    });
});

exports.deleteJobListing = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    if (!jobId) {
        return res.status(400).json({
            message: 'Missing job id'
        });
    }

    const deleteListing = await db.collection('jobListings').deleteOne({
        _id: jobId
    });

    if (!deleteListing) {
        return res.status(500).json({
            message: 'Failed to delete job listing'
        });
    }

    res.status(200).json({
        message: 'DELETE job listing'
    });
})