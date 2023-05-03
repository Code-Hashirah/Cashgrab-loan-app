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
    // const {Type, Amount, Duration}=req.body;
    // const errors=validationResult(req);
    // if(! errors.isEmpty()){
    //     return res.status(422).json(errors.array())
    // }
    // Loans.create({
    //     loanType:Type,
    //     amount:Amount,
    //     duration:Duration
    // }).then(loan=>{
    //     if(loan){
    //         return res.status(201).json({
    //          success:true
    //         })  
    //          }
    // }).catch(err=>{
    //     return res.status(500).json({
    //         error: err,
    //         msg:"Something went wrong"
    //       })
    // })
    // return res.status(200).json('MashaAllah')
    // console.log('Done for now unshaAllah!')
    const loanData = req.body;
    // const errors=validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(422).json(errors.array())
    //     // console.log("error")
    // }
    Loans.create(loanData)
        .then(()=>{
            res.send({ success: true });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({ success: false, error: 'An error occurred while saving the loan.' });
        });
}