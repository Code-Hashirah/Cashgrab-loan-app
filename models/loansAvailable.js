const sequelize=require('../database/db');
const {DataTypes}=require('sequelize');
const loans=sequelize.define('loans',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    loanType:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    duration:{
        type:DataTypes.STRING,
        allowNull:false
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})
module.exports=loans;