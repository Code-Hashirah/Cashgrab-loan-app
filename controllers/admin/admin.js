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

exports.adminDeleteLoan=(req,res)=>{
    const {Id}=req.body;
    Loans.findOne({where:{
        id:Id
    }}).then(loanData=>{
        return loanData.destroy()
    }).then(deleted=>{
        req.session.save(()=>{
            res.redirect('/admin-manage-loans')
        })
    })
}

exports.adminUpdateLoandPage=(req,res)=>{
    let error=req.flash('productErr');
    let success = req.flash('success');
    let adminData=req.session.user;
    let Id = req.params.id;
    Loans.findOne({where:{
        id:Id
    }}).then(loan=>{
        res.render('admin/update-loan.ejs', {title:"Update Loan", Loan:loan, Admin:adminData,error:error, success:success})
    })
}

exports.adminUpdateLoanPost= async (req,res)=>{
    try {
        const { id, Type, Duration, Amount } = req.body

        // Retrieve the record by its ID
        const loan = await Loans.findByPk(id)

        // Update the fields with the new values
        loan.Type = Type
        loan.Duration = Duration
        loan.Amount = Amount

        // Save the changes to the database
        await loan.save()

        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Failed to update loan record' })
    }
}