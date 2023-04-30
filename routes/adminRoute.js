const adminController=require('../controllers/admin/admin')
const router=require('express').Router()
const {check}= require('express-validator')
router.get('/admin-dashboard',adminController.adminDashboard)

router.get('/admin-add-loan',adminController.adminAddLoanPage)
router.post('/admin-add-loan',adminController.adminAddLoanPost)

module.exports=router;