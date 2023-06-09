// const Sequelize=require('sequelize');
const express=require('express');
const path=require('path');
const app=express();
const bodyParsee=require('body-parser');
const multer=require('multer');
const sequelize =require('./database/db')
const Users=require('./models/users')
const Loans= require('./models/loansAvailable')
const loansTaken=require('./models/loansTaken')
const loansPayed=require('./models/loansPayed')
const UserRoute=require('./routes/userRoute')
const authRoute=require('./routes/authRoute')
const adminRoute=require('./routes/adminRoute')
const bodyParser=require('body-parser')
const bodyParser2=require('body-parser')
const session=require('express-session')
const Session=require('./models/session')
const SequelizeStore=require('connect-session-sequelize')(session.Store)
const flash = require('connect-flash')
const ErrController=require('./controllers/errors')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({encoded:true}));
app.use(bodyParser2.json())


let storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, 'public/filesFolder');
  },
  filename: (req, files, cb) => {
    const allowedImageTypes = ['image/png', 'image/jpeg'];
    const allowedDocumentTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (files.fieldname === 'picture' || files.fieldname === 'Picture') {
      // Filter for image uploads
      if (allowedImageTypes.includes(files.mimetype)) {
        cb(null, Date.now() + 'file' + files.originalname);
      } else {
        cb(new Error('Invalid file type for image.'));
      }
    } else if (files.fieldname === 'BankStatement' || files.fieldname === 'ID') {
      // Filter for document uploads
      if (allowedDocumentTypes.includes(files.mimetype)) {
        cb(null, Date.now() + 'file' + files.originalname);
      } else {
        cb(new Error('Invalid file type for document.'));
      }
    } else {
      cb(new Error('Invalid field name: ' + files.fieldname));
    }
  }
});


//---------------------------

//------------===========

app.use(multer({storage:storage}).fields([
    {name:'Picture', maxCount:1},
    {name:'BankStatement', maxCount:5},
    {name:'ID', maxCount:3}
]))
app.set('view engine', 'ejs');
app.use(flash())
app.use(session({
    secret:'my secrets',
    resave:false,
    saveUninitialized:false,
    store:new SequelizeStore({
        db:sequelize,
    }),
    cookie:{}
}))

app.use((req,res,next)=>{
    res.locals.isLoggedIn=req.session.isLoggedIn;
    res.locals.user=req.session.user
    next()
})

app.use(UserRoute)
 app.use(authRoute)
 app.use(adminRoute)

//  End of code ]



 app.get('/500',ErrController.error500 )
app.use(ErrController.error404)
// app.use((error, req, res, next)=>{
//   next()
//   return res.redirect('/500')
// })
//  loansTaken.sync({alter:true})
// Users.sync({alter:true})
// Loans.sync({force:true})
sequelize.sync().then(port=>{
    app.listen(3007)
    console.log("connected to port 3007")
})
.catch(err=>{
    console.log(err);
})