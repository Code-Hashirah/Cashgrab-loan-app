const Sequelize=require('sequelize');
const db=new Sequelize('loan','root', '',{
    host:'localhost',
    dialect:'mysql'
})

module.exports=db;