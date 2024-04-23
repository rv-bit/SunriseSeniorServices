const express = require('express');
const router = express.Router();

const joblistingController = require('../controllers/joblisting');

router.get('/', joblistingController.getJobListings);
router.get('/viewjob', joblistingController.getJobListings);
router.post('/new', joblistingController.createJobListing);

module.exports = router;