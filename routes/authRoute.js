const authController=require('../controllers/auth/authUser')
const adminAuthController=require('../controllers/auth/authAdmin')
const router= require('express').Router()
const {isEmpty}=require('validator');
const {check}=require('express-validator')

router.get('/sign-up',authController.signUp)
router.post('/sign-up',authController.signUpPost)

router.get('/otp',authController.otpPage)
router.post('/otp',authController.otpPost)

router.get('/sign-in',authController.signInPage)
router.post('/sign-in',authController.signIn)

router.get('/sign-out',authController.signOut)

// *************************************************************************************
// Admin authentication section
// Sign Up admin 
router.get('/admin-sign-up',adminAuthController.adminSignInPage)
router.post('/admin-sign-up',adminAuthController.adminSignInPost)
// OTP admin code 
router.get('/admin-otp',adminAuthController.adminOtpPage)
router.post('/admin-otp',adminAuthController.adminOtpPost)
// Sign in admin 
router.get('/admin-sign-in',adminAuthController.adminSignInPage)
router.post('/admin-sign-in',adminAuthController.adminSignInPost)
module.exports=router;