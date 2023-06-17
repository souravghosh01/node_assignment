const express = require('express');
const router = express.Router()
const community = require('../controllers/community');
const auth = require('../auth/auth')
const {ValidateCreateCommunity} = require('../middleware/validation')



router.post('/', auth.authentication,ValidateCreateCommunity, community.createCommunity);

router.get('/', community.getAllCommunities);

router.get('/:id/members', community.getAllMembers);

router.get('/me/owner', auth.authentication, community.getMyOwnCommunities);

router.get('/me/member', auth.authentication, community.getMyJoinedCommunities);



module.exports = router;
