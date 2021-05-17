const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.ctrl')
const uploadImage = require('../controllers/multer/upload')


//Get method
router.get('/create', (req, res) => res.render('create_blog'))
router.get('/edit/:id', blogController.getBlogToUpdate)
router.get('/delete/:id', blogController.deleteBlog)


//Post method
router.post('/create', uploadImage.upload.single('blog_image'), blogController.createBlog)
router.post('/edit/:id', uploadImage.upload.single('blog_image'), blogController.updateBlog);



module.exports = router;