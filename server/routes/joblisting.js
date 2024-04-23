const express = require('express');
const router = express.Router();

const joblistingController = require('../controllers/joblisting');

router.get('/', joblistingController.getJobListings);
router.post('/', joblistingController.createJobListing);

module.exports = router;