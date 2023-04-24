const session = require('express-session')
const User=require('../../models/users')
const bcrypt=require('bcrypt')

exports.homePage=(req, res)=>{
    res.render('index.ejs', {title:"Cash Grab Home"})
}