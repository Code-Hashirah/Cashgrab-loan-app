const Users=require('../../models/users')
const bcrypt=require('bcrypt')
const session = require('express-session')
const nodemailer=require('nodemailer')
exports.signUp=(req,res)=>{
    res.render('users/registration', {title:"Cash Grab Sign Up"})
}

exports.signUpPost=(req,res)=>{
    let pin;
    let OTP=[]
    for (let num = 0; num <6; num++) {
        pin=Math.floor(Math.random()*10)
        OTP+=pin   
    }
    console.log(OTP)
  const {Email,Password}=req.body;
  bcrypt.hash(Password,12).then(hashedPassword=>{
    Users.create({
        email:Email,
        password:hashedPassword,
        otp:OTP
    }).then(savedUser=>{
        // email sending 
        const email={
            to:[savedUser.email, 'newuser@cashgrab.com'],
            from:{
                name: 'Cash Grab',
                email:'info@cashgrab.com.ng'
            },
            subject:'Welcome' +savedUser.email+' thank you for registering with us',
            html:`
            <h2> OTP Confirmation </h2>
            <p> here is your One time password ${savedUser.otp} it will expire in 30 minutes </p>
            `
        }
        var transport=nodemailer.createTransport({
            host:"sandbox.smtp.mailtrap.io",
            port:2525,
            auth:{
                user: "58b42af4ae2024",
                pass: "822d08109dd72d"
            }
        })
        transport.sendMail(email).then((response)=>{
            res.redirect('/')
        }).catch(err=>{
            console.log(err)
        })
        res.redirect('/otp')
    }).catch(err=>{
        console.log(err)
    })
  })
   
    .catch(err=>{
        console.log(err)
    })
}

exports.otpPage=(req,res)=>{
    res.render('users/OTP',{title:"OTP page"})
}

exports.otpPost=(req,res)=>{
    const {OTP}=req.body;
    Users.findOne({where:{
        otp:OTP
    }}).then(confirmed=>{
        res.redirect('/user-dashboard')
    }).catch(err=>{
        console.log(err)
    })
}

