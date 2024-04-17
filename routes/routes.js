var express = require('express');
var router = express.Router();
router.use('/', require('../controllers/StoreContactController'));

module.exports = router;