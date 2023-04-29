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
const UserRoute=require('./routes/userRoute')
const authRoute=require('./routes/authRoute')
const adminRoute=require('./routes/adminRoute')
const bodyParser=require('body-parser')
const session=require('express-session')
const Session=require('./models/session')
const SequelizeStore=require('connect-session-sequelize')(session.Store)
const flash = require('connect-flash')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({encoded:true}));
//  app.use(UserRoute)
//  app.use(authRoute)


let storage = multer.diskStorage({
    destination:(req,files, cb)=>{
        cb(null,'public/filesFolder')
    },
    filename:(req,files, cb)=>{
        cb(null, Date.now()+'file'+files.originalname)
    }
})
app.use(multer({storage:storage}).fields([
    {name:'Picture', maxCount:1},
    {name:'Letter', maxCount:5},
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
// Users.sync({alter:true})
sequelize.sync().then(port=>{
    app.listen(3007)
    console.log("connected to port 3007")
})
.catch(err=>{
    console.log(err);
})