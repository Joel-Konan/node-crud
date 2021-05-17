const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.ctrl')
const blogController = require('../controllers/blog.ctrl')


//Get method
router.get('/register', (req, res) => res.render('register'))
router.get('/login', (req, res) => res.render('login'))
router.get('/logout', userController.deconnexion)






//Post method
router.post('/register', userController.register)
router.post('/login', userController.connexion)




module.exports = router;
