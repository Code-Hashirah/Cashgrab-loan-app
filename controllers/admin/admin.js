const Loans=require('../../models/loansAvailable');
const session = require('express-session');
 

exports.adminDashboard=(req,res)=>{
    let adminData=req.session.user;
    res.render('admin/admin-dashboard.ejs',{title:"Admin Dashboard",Admin:adminData})
}

exports.adminAddLoanPage=(req,res)=>{
    let adminData=req.session.user;
res.render('admin/add-loan.ejs', {title:"Cash Grab Add Loans",Admin:adminData})
}

exports.adminAddLoanPost=(req,res)=>{
    console.log('Done for now unshaAllah!')
}