const adminController=require('../controllers/admin/admin')
const router=require('express').Router()
const {check}= require('express-validator')
const isAdmin=require('../middlewares/isAdmin')
const isAuth=require('../middlewares/isAuth')
router.get('/admin-dashboard',isAuth,adminController.adminDashboard)

router.get('/admin-add-loan',isAdmin,isAuth,adminController.adminAddLoanPage)
router.post('/admin-add-loan',[
    check('Type').notEmpty().withMessage('This field is required'),
    check('Duration').notEmpty().withMessage('This field is required'),
    check('Amount').notEmpty().withMessage('This field is required')
],adminController.adminAddLoanPost)

router.get('/admin-manage-loans',isAdmin,isAuth,adminController.adminManageLoans)
router.post('/admin-delete-loan',isAdmin,isAuth,adminController.adminDeleteLoan)

router.get('/admin-update-loan/:id',isAdmin,isAuth,adminController.adminUpdateLoandPage)
router.post('/admin-update-loans',adminController.adminUpdateLoanPost)
module.exports=router;