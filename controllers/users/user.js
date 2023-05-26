const session = require('express-session')
const User=require('../../models/users')
const bcrypt=require('bcrypt')
const Loans=require('../../models/loansAvailable')
const loansTaken=require('../../models/loansTaken')

exports.homePage=(req, res)=>{
    res.render('index.ejs', {title:"Cash Grab Home"})
}

exports.dashboardPage=(req,res)=>{
    let UserData=req.session.user
    let user=[];
    for(let value in UserData){
        user.push(value)
    }
    console.log(user.length)
   let count=0;
    for(let value in UserData){
        if(UserData[value]!==null){
            count++
        }
    }
    console.log(count)
    let total=user.length;
    let complete ;
    complete=Math.ceil( count/total*100)
    console.log(complete+"%")    
    Loans.findAll().then(loans=>{
         res.render('users/dashboard.ejs',{title:"Cash Grab Dashboard", User:UserData, Percent:complete, Loans:loans})
    })
   
   
}

exports.updateProfilePage=(req,res)=>{
    res.render('users/update-profile.ejs',{title:"Improve Profile"})
}

exports.updateProfilePost=(req,res)=>{
    let userID=req.session.user.id;
    console.log(userID)
    const {Name,Phone, Bvn, Bank,Salary,Account, Address}=req.body
    let Role="User"
    let IdPath='/filesFolder/'+req.files.ID[0].filename;
    let BankStatementPath='/filesFolder/'+req.files.BankStatement[0].filename;
    let PassportPicPath='/filesFolder/'+req.files.Picture[0].filename;
    User.findOne({where:{
        id:userID
    }}).then(user=>{
        user.name=Name,
        user.phone=Phone,
        user.bvn=Bvn,
        user.bank=Bank,
        user.salary=Salary,
        user.account=Account,
        user.address=Address,
        user.role=Role,
        user.idCard=IdPath,
        user.bankStatement=BankStatementPath,
        user.picture=PassportPicPath
      return  user.save()
    }).then(updated=>{
        req.session.save(()=>{
       return     res.redirect('user-dashboard')
        })
    }).catch(err=>{
        console.log(err)
    })
}
exports.applyLoan=(req,res)=>{
    let dateApplied=Date.now();
    const {Email,Name,Phone,Bvn,Bank,Account,Picture,LoanType,LoanAmount,LoanDuration}=req.body;
    loansTaken.create({
         name:Name,
         email:Email,
         phone:Phone,
         bvn:Bvn,
         bank:Bank,
         account:Account,
         picture:Picture,
         loanType:LoanType,
         amount:LoanAmount,
         duration:LoanDuration,
    }).then(takenLoan=>{
        res.redirect('/user-dashboard')
    })
}