const userController= require('../controllers/users/user')
const router = require('express').Router()
const {isEmpty}=require('validator');
const {check}=require('express-validator')
const isAdmin=require('../middlewares/isAdmin')
const isAuth=require('../middlewares/isAuth')

router.get('/', userController.homePage)
router.get('/user-dashboard',isAuth,userController.dashboardPage)

router.get('/update-profile',isAuth,userController.updateProfilePage)
router.post('/update-profile', [
    check('Name').notEmpty().withMessage('Name cannot be blank'),
    check('Phone').notEmpty().withMessage('Phone number cannot be blank'),
    check('Bvn').notEmpty().withMessage('You BVN is required cannot be blank'),
    check('Bank').notEmpty().withMessage('Field cannot be blank cannot be blank'),
    check('Salary').notEmpty().withMessage('Field cannot be blank cannot be blank'),
    check('Account').notEmpty().withMessage('Field cannot be blank cannot be blank').isLength(10).withMessage('Account number cannot be mor or less than 10 characters long'),
    check('Address').notEmpty().withMessage('Field cannot be blank cannot be blank')
],userController.updateProfilePost)

router.post('/apply-loan',userController.applyLoan)

router.get('/get-users',userController.getApi)

module.exports=router;