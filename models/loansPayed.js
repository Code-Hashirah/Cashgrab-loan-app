const sequelize=require('../database/db')
const {DataTypes}=require('sequelize')
const loansPayed=sequelize.define('loansPayed',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    email:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    duration:{
        type:DataTypes.STRING,
        allowNull:false
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
})
module.exports=loansPayed;