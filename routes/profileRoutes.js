const express = require('express');
const profileController = require('../controllers/userProfileController');
const router = express.Router();
const upload=require('../middleware/upload')
const {isAuthenticated} = require('../middleware/auth');

router.get('/profiles',isAuthenticated,profileController.profile)
router.get('/create_profile',isAuthenticated,profileController.profileForm);
router.post('/', upload,isAuthenticated,profileController.createProfile);
router.get('/:id/edit',isAuthenticated,profileController.editProfileForm);
router.post('/:id/edit',upload,isAuthenticated,profileController.editProfile);
router.post('/:id/delete',isAuthenticated,profileController.deleteProfile);

module.exports = router;