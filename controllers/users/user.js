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
    // console.log(UserData)
    // console.log("hello")
}