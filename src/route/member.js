const express = require('express');
const router = express.Router()
const member = require('../controllers/member');
const auth = require('../auth/auth')
const {validateAddMember}=  require('../middleware/validation')



router.post('/', auth.authentication,validateAddMember, member.addMember);

router.delete('/:id', auth.authentication, member.removeMember);


module.exports = router;
