const Users=require('../../models/users')
const bcrypt=require('bcrypt')
const session = require('express-session')
const nodemailer=require('nodemailer')
const {validationResult}=require('express-validator')
const crypto=require('crypto')

exports.signUp=(req,res)=>{
    let errors=req.flash('Errors');
    res.render('users/registration', {title:"Cash Grab Sign Up", ErrorMsg:errors})
}

exports.signUpPost=(req,res)=>{
let error=validationResult(req)
if(!error.isEmpty()){
    req.flash('Errors',error.array())
    console.log(error)
    return req.session.save(()=>{
        return res.redirect('/sign-up')
    })
}
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
            // res.redirect('/')
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
    const Error=req.flash('error')
    res.render('users/OTP',{title:"OTP page", OtpError:Error})
}

exports.otpPost=(req,res)=>{
    let otpErr=validationResult(req)
   if(!otpErr.isEmpty()){
    req.flash('error',otpErr.array())
    return req.session.save(()=>{
        return res.redirect('/otp')
    })
   }
    const {OTP}=req.body;
    Users.findOne({where:{
        otp:OTP
    }}).then(confirmed=>{
        req.session.isLoggedIn=true;
        req.session.user=confirmed;
        res.redirect('/user-dashboard')
    }).catch(err=>{
        console.log(err)
    })
}

exports.signInPage=(req,res)=>{
    let Error=req.flash('AdminLogErr')
    res.render('users/login.ejs', {title:"Cash Grab Sign-In", UserErr:Error})
   
}

exports.signIn=(req,res)=>{
    let error=validationResult(req)
    if(!error.isEmpty()){
        req.flash('AdminLogErr', error.array())
        console.log(error)
        return req.session.save(()=>{
            return res.redirect('/sign-in')
        })
    }
    const {Email, Password}=req.body
    Users.findOne({where:{
        email:Email
    }}).then(userDetails=>{
        if(!userDetails){
        res.redirect('/sign-in')
        
        }
        bcrypt.compare(Password,userDetails.password).then(verifiedUser=>{
            if(!verifiedUser){
                res.redirect('/sign-in')
            }
            req.session.isLoggedIn=true;
            req.session.user=userDetails
            return req.session.save(()=>{
                res.redirect('/user-dashboard')
            })
        })
    })
}
exports.signOut=(req,res)=>{
    req.session.destroy(()=>{
      return   res.redirect('/sign-in')
    }) 
}