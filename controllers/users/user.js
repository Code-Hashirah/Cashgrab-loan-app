const session = require('express-session')
const User=require('../../models/users')
const bcrypt=require('bcrypt')
const Loans=require('../../models/loansAvailable')
const loansTaken=require('../../models/loansTaken')
const nodemailer=require('nodemailer')
const date = require('date-and-time')
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
        const delay = parseInt(takenLoan.duration) * 30 * 24 * 60 * 60 * 1000; //  months * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
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