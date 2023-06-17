const express = require('express');
const router = express.Router()
const user = require('../controllers/user');
const auth = require('../auth/auth')
const {validateSignup,validateSignin} = require('../middleware/validation')


router.post('/signup',validateSignup, user.createUser);

router.post('/signin', validateSignin, user.loginUser);

router.get('/me', auth.authentication, user.getUser);


module.exports = router;
