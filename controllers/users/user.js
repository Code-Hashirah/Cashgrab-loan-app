const session = require('express-session')
const User=require('../../models/users')
const bcrypt=require('bcrypt')
const Loans=require('../../models/loansAvailable')
const loansTaken=require('../../models/loansTaken')
const nodemailer=require('nodemailer')
const date = require('date-and-time')
const { validationResult } = require('express-validator')
// Authorization: 'Bearer ' + process.env.PUBLIC_KEY
// const https = require('https');
// require('dotenv').config();

// *********Data for API ******
exports.getApi=(req,res, next)=>{
    User.findAll().then(users=>{
        res.json(users)
    })
}
// ************************Main Code ***********************
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
    let updateErr=req.flash('UpdateError')
    res.render('users/update-profile.ejs',{title:"Improve Profile", UpdateError:updateErr})
}

exports.updateProfilePost=(req,res)=>{
    let Errors=validationResult(req)
    if(!Errors.isEmpty()){
        req.flash('UpdateError', Errors.array())
        console.log(Errors)
        return req.session.save(()=>{
            return res.redirect('/update-profile')
        })
    }
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
      return  req.session.save(()=>{
       return     res.redirect('user-dashboard')
        })
    }).catch(err=>{
        console.log(err)
    })
}
exports.applyLoan=(req,res)=>{
    let dateApplied = new Date(); // Current date and time
    let newMonth = new Date(dateApplied.getFullYear(), dateApplied.getMonth() + 4, dateApplied.getDate());
  
    console.log(newMonth)
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
         returned:"No"
    }).then(takenLoan=>{
         // email sending 
         const email={
            to:[takenLoan.email, 'newuser@cashgrab.com'],
            from:{
                name: 'Cash Grab',
                email:'info@cashgrab.com.ng'
            },
            subject:'Hello' +' ' +takenLoan.name+' thank you for applying for loan with us',
            html:`
            <h2> Loan Approval</h2>
            <p> Your loan of ${takenLoan.amount} has been and approved and sent to account number  ${takenLoan.account} ${takenLoan.bank}</p>
            <p> Your are expected to return this loan in ${takenLoan.duration} months time. Thanks in advance for your cooperation</p>
            `
        }
        var transport=nodemailer.createTransport({
            host:"sandbox.smtp.mailtrap.io",
            port:2525,
            auth:{
                // user: "1c15f97e3e1bb1",
                // pass: "5a4c15cba87f06"
                user: "58b42af4ae2024",
                pass: "822d08109dd72d"
            }
        })
        transport.sendMail(email).then((response)=>{
            // res.redirect('/')
        }).catch(err=>{
            console.log(err)
        })
        //This is where the delay timeOut will come
        const delay = parseInt(Math.ceil(takenLoan.duration) * 30 * 24 * 60 * 60*200)+1; //  months * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
        function sendReminder(){
            // Calculate the delay for 4 months in milliseconds
          
            // email sending 
            const email={
               to:[takenLoan.email, 'newuser@cashgrab.com'],
               from:{
                   name: 'Cash Grab',
                   email:'info@cashgrab.com.ng'
               },
               subject:'Hello' +' ' +takenLoan.name+' This is a reminder!',
               html:`
               <h2> Loan Payment Reminder</h2>
               <p> This is a reminder that your loan of ${takenLoan.amount} is due for refund, if you recall, it was sent to your ${takenLoan.bank} account number ${takenLoan.account} </p>
               <p> Your are expected to return this loan in ${takenLoan.duration} months  time, as mentioned when your loan was granted, the said duration has elapsed you are expected to do the needful. Thanks as you pa up to avoid confiscation of assets</p>
               <p>CashGrab Admin </p>
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
       }
       setTimeout(sendReminder,delay)
        console.log(delay/10000)
        res.redirect('/user-dashboard')
    }).catch(err2=>{
        console.log(err2)
    })
}
exports.payBackLoanGet=(req,res)=>{
    let UserEmail=req.session.user.email;
    loansTaken.findAll({
        where:{
            email:UserEmail
        }
    }).then(user=>{
        res.render('users/payLoan.ejs', {title:"Pay Loan", User:user})
    })
    
}

    // ***second code **** 


    exports.payBackLoanPost = (req, res) => {
        const https = require('https');
        // const url = 'https://api.paystack.co/transaction/initialize';
        const {Email, Amount}=req.body
        const fields = {
          email: Email,
          amount: Amount*100,
          callback_url: 'localhost:3007/pay-loan' 
        };
      
        const fieldsString = new URLSearchParams(fields).toString();
      
        const options = {
          hostname: 'api.paystack.co',
          path: '/transaction/initialize',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(fieldsString)
          }
        };
      
         req = https.request(options, (response) => {
          let responseData = '';
      
          response.on('data', (chunk) => {
            responseData += chunk;
          });
      
          response.on('end', () => {
            const parsedResponse = JSON.parse(responseData);
            const authorizationURL = parsedResponse.data.authorization_url;
            console.log('Authorization URL:', authorizationURL);
      
            // Redirect to the authorization URL
            res.redirect(authorizationURL);
          });
        });
      
        req.on('error', (error) => {
          console.error('Request error:', error);
          res.status(500).send('Internal Server Error');
        });
      
        req.write(fieldsString);
        req.end();    
      };
      
