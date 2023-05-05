const session = require('express-session')
const User=require('../../models/users')
const bcrypt=require('bcrypt')

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
    res.render('users/dashboard.ejs',{title:"Cash Grab Dashboard", User:UserData, Percent:complete})
   
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