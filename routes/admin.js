const express =require('express');

const router = express.Router();
const adminController = require('../controller/adminController');
const { procted,auth } = require('../middleware/adminAuth');
const nocache = require("nocache")
 

router.get('/login',auth,adminController.loadLogin)
router.post('/login',nocache(),adminController.login)
router.get('/dashboard',procted,adminController.loadDashboard)
router.post('/search-user',nocache(),procted,adminController.searchUsers)
router.post('/edit-user',nocache(),procted,adminController.editUser)
router.get('/delete-user/:id',procted,adminController.deleteUser)
router.post('/add-user',nocache(),procted,adminController.addUser)
router.get('/logout',procted,adminController.logout)

module.exports =router