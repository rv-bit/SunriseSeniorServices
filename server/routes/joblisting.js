const express = require('express');
const router = express.Router();

const joblistingController = require('../controllers/joblisting');

router.get('/', joblistingController.getJobListings);
router.get('/:id', joblistingController.getJobListingUserFromId);
router.get('/viewjob/:id', joblistingController.getJobListingsFromId);
router.post('/createListing', joblistingController.createJobListing);
router.delete('/deleteListing/:id', joblistingController.deleteJobListing);

module.exports = router;