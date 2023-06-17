const express = require('express');
const router = express.Router()
const role = require('../controllers/role');
const {validateRole} = require('../middleware/validation')

router.post('/', validateRole, role.createRole);

router.get('/', role.getRoles);



module.exports = router;
