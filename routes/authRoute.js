const authController=require('../controllers/auth/authUser')
const adminAuthController=require('../controllers/auth/authAdmin')
const router= require('express').Router()
const {isEmpty}=require('validator');
const {check}=require('express-validator')

router.get('/sign-up',authController.signUp)
router.post('/sign-up',[
    check('Email').notEmpty().withMessage('Email cannot be blank').isEmail().withMessage('Invalid Email').normalizeEmail(),
    check('Password').notEmpty().withMessage('Password cannot be empty').isLength({min:6}).withMessage('Password must be more than 6 characters long'),
    check('ConfirmPassword').notEmpty().withMessage('This field is required').custom((value, {req})=>{
        if(value!==req.body.Password){
            throw new Error('The Passwords do not match')
        } return true;
    })
],authController.signUpPost)

router.get('/otp',authController.otpPage)
router.post('/otp',[

],authController.otpPost)

router.get('/sign-in',authController.signInPage)
router.post('/sign-in',[
    check('Email').notEmpty().withMessage('Email cannot be blank').isEmail().withMessage('Invalid Email').normalizeEmail(),
    check('Password').notEmpty().withMessage('Password cannot be empty').isLength({min:6}).withMessage('Password must be more than 6 characters long')
],authController.signIn)

router.get('/sign-out',authController.signOut)

// *************************************************************************************
// Admin authentication section
// Sign Up admin 
router.get('/admin-sign-up',adminAuthController.adminSignUpPage)
router.post('/admin-sign-up',adminAuthController.adminSignUpPost)
// OTP admin code 
router.get('/admin-otp',adminAuthController.adminOtpPage)
router.post('/admin-otp',adminAuthController.adminOtpPost)
// Sign in admin 
router.get('/admin-sign-in',adminAuthController.adminSignInPage)
router.post('/admin-sign-in',adminAuthController.adminSignInPost)
module.exports=router;