const Loans=require('../../models/loansAvailable');
const session = require('express-session');
const { validationResult } = require('express-validator');
 

exports.adminDashboard=(req,res)=>{
    let adminData=req.session.user;
    res.render('admin/admin-dashboard.ejs',{title:"Admin Dashboard",Admin:adminData})
}

exports.adminAddLoanPage=(req,res)=>{
    let error=req.flash('productErr');
    let success = req.flash('success');
    let adminData=req.session.user;
res.render('admin/add-loan.ejs', {title:"Cash Grab Add Loans",Admin:adminData,error:error, success:success})
}

exports.adminAddLoanPost=(req,res)=>{
   
    const loanData = req.body;
  
    Loans.create(loanData)
        .then(()=>{
            res.send({ success: true });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({ success: false, error: 'An error occurred while saving the loan.' });
        });
}
exports.adminManageLoans=(req, res)=>{
    Loans.findAll().then(loans=>{
        res.render('admin/manage-loans.ejs', {title:"Manage Loans", Loans:loans})
    })
}