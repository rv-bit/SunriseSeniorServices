const express = require('express');
const router = express.Router();

const joblistingController = require('../controllers/joblisting');

router.get('/', joblistingController.getJobListings);
router.get('/:id', joblistingController.getJobListingUserFromId);
router.get('/viewjob', joblistingController.getJobListings);
router.post('/createListing', joblistingController.createJobListing);

module.exports = router;