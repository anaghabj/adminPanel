const express = require('express')
const router = express.Router();
const userController = require('../controller/userController')
const { auth, procted } = require("../middleware/sessionCheck")
const nocache = require("nocache")

router.get('/login', auth, userController.loadLogin)
router.post('/login', nocache(), userController.login)
router.get('/register', auth, userController.loadRegister)
router.post('/register', nocache(), userController.registerUser)
router.get('/home', procted, userController.loadHome)
router.get('/logout', userController.logout)

module.exports = router 

