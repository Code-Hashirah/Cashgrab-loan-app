const userController= require('../controllers/users/user')
const router = require('express').Router()
const {isEmpty}=require('validator');
const {check}=require('express-validator')

router.get('/', userController.homePage)
router.get('/user-dashboard',userController.dashboardPage)

router.get('/update-profile',userController.updateProfilePage)
router.post('/update-profile',userController.updateProfilePost)
module.exports=router;