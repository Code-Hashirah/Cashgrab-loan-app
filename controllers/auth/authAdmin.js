const Users=require('../../models/users')
const bcrypt=require('bcrypt')
const session =require('express-session')
const {validationResult}=require('express-validator')
const nodemailer=require('nodemailer')
const fs =require('fs')

exports.adminSignUpPage=(req,res)=>{
    let errorsAdmin=req.flash('AdminErrors');
    res.render('admin/registration.ejs', {title:"Cash~Grab Admin Registration", ErrorMsg:errorsAdmin})
}

exports.adminSignUpPost=(req,res)=>{
    let error=validationResult(req)
    if(!error.isEmpty()){
        req.flash('AdminErrors', error.array())
        console.log(error)
        return req.session.save(()=>{
            return res.redirect('/admin-sign-up')
        })
    }
    let pin;
    let OTP=[]
    for (let num = 0; num <6; num++) {
        pin=Math.floor(Math.random()*10)
        OTP+=pin   
    }
    console.log(OTP)
  const {Email,Name,Password,Phone}=req.body;
  const errors=validationResult(req);
  if(!errors.isEmpty()){
      req.flash('errors', errors.array())
      return req.session.save(()=>{
          res.redirect('/admin-sign-in')
      })
  }
  bcrypt.hash(Password,12).then(hashedPassword=>{
    let IdPath='/filesFolder/'+req.files.ID[0].filename;
    let PicturePath='/filesFolder/'+req.files.Picture[0].filename;
    let Role="Admin"
    Users.create({
        email:Email,
        password:hashedPassword,
        name:Name,
        phone:Phone,
        otp:OTP,
        role:Role,
        idCard:IdPath,
        picture:PicturePath
    }).then(savedUser=>{
        // email sending 
        const email={
            to:[savedUser.email, 'newadmin@cashgrab.com'],
            from:{
                name: 'Cash Grab',
                email:'info@cashgrab.com.ng'
            },
            subject:'Welcome Admin' +savedUser.name+' thank you for choosing to work with us',
            html:`
            <h2> OTP Confirmation </h2>
            <p> here is your One time password ${savedUser.otp} it will expire in 30 minutes </p>
            <p> here is your password ${Password} do change it as soon as possibel </p>
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

        }).catch(err=>{
            console.log(err)
        })
        res.redirect('/admin-otp')
    }).catch(err=>{
        console.log(err)
    })
  })
   
    .catch(err=>{
        console.log(err)
    })
} 
// OTP codes 
exports.adminOtpPage=(req,res)=>{
    const Error=req.flash('error')
    res.render('admin/OTP',{title:"Admin::OTP page", otpError:Error})
}

exports.adminOtpPost=(req,res)=>{
  
    const {OTP}=req.body;
    let otpErr=validationResult(req)
    if(!otpErr.isEmpty()){
     req.flash('error',otpErr.array())
     return req.session.save(()=>{
         return res.redirect('/admin-otp')
     })
    }
    Users.findOne({where:{
        otp:OTP
    }}).then(confirmed=>{
        req.session.isLoggedIn=true;
        req.session.user=confirmed;
        res.redirect('/admin-dashboard')
    }).catch(err=>{
        console.log(err)
    })
}

// Sign in code 
exports.adminSignInPage=(req,res)=>{
  let Error=req.flash('AdminLogErr')
    res.render('admin/login.ejs', {title:"Admin::Cash Grab Sign-In", AdminErr:Error})
   
}

exports.adminSignInPost=(req,res)=>{
    let error=validationResult(req)
    if(!error.isEmpty()){
        req.flash('AdminLogErr', error.array())
        console.log(error)
        return req.session.save(()=>{
            return res.redirect('/admin-sign-in')
        })
    }
    const {Email, Password}=req.body
    Users.findOne({where:{
        email:Email,
        role:'Admin'
    }}).then(userDetails=>{
        if(!userDetails){
            req.flash('error', 'user  email or password incorrect')
            return req.session.save(() => {
                res.redirect('/admin-sign-in')
                return userDetails
            })
            
        }
        bcrypt.compare(Password,userDetails.password).then(verifiedUser=>{
            if(!verifiedUser){
                res.redirect('/admin-sign-in')
            }
            req.session.isLoggedIn=true;
            req.session.user=userDetails
            return req.session.save(()=>{
              res.redirect('/admin-dashboard')
            })
        })
    })
}
// Sign out code 
exports.adminSignOut=(req,res)=>{
    req.session.destroy(()=>{
      return   res.redirect('/admin-sign-in')
    }) 
}