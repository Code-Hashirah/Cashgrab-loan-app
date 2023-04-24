const userController= require('../controllers/users/user')
const router = require('express').Router()
const {isEmpty}=require('validator');
const {check}=require('express-validator')

router.get('/', userController.homePage)


module.exports=router;