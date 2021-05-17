var express = require('express');
var router = express.Router();
const blogController = require('../controllers/blog.ctrl')

/* GET home page. */
router.get('/', blogController.getAllBlogs);

module.exports = router;
