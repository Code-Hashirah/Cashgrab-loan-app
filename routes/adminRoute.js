const adminController=require('../controllers/admin/admin')
const router=require('express').Router()
const {check}= require('express-validator')
router.get('/admin-dashboard',adminController.adminDashboard)

router.get('/admin-add-loan',adminController.adminAddLoanPage)
router.post('/admin-add-loan',[
    check('Type').notEmpty().withMessage('This field is required'),
    check('Duration').notEmpty().withMessage('This field is required'),
    check('Amount').notEmpty().withMessage('This field is required')
],adminController.adminAddLoanPost)

router.get('/admin-manage-loans',adminController.adminManageLoans)
router.post('/admin-delete-loan',adminController.adminDeleteLoan)

router.get('/admin-update-loan/:id',adminController.adminUpdateLoandPage)
router.post('/admin-update-loan',adminController.adminUpdateLoanPost)
module.exports=router;