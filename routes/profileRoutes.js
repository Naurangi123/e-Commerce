const express = require('express');
const profileController = require('../controllers/userProfileController');
const router = express.Router();
const upload=require('../middleware/upload')
const {isAuthenticated} = require('../middleware/auth');

router.get('/profiles',isAuthenticated,profileController.profile)
router.get('/create_profile',isAuthenticated,profileController.profileForm);
router.post('/profiles', upload,isAuthenticated,profileController.createProfile);
router.get('/:_id/edit',isAuthenticated,profileController.editProfileForm);
router.put('/:_id/',upload,isAuthenticated,profileController.editProfile);
router.delete('/:_id',isAuthenticated,profileController.deleteProfile);

module.exports = router;