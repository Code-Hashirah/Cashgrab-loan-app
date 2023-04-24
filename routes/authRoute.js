const authController=require('../controllers/auth/authUser')
const router= require('express').Router()
const {isEmpty}=require('validator');
const {check}=require('express-validator')

router.get('/sign-up',authController.signUp)
router.post('/sign-up',authController.signUpPost)

router.get('/otp',authController.otpPage)
module.exports=router;