const express=require('express');
const mongoose=require('mongoose')
const Users=require('../models/Users');
const Orders=require('../models/Orders');
const Admin=require('../models/Admin');
const jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser')
const JWT_SECRET='madebykrutik'
const bcrypt=require('bcrypt');
const router=express.Router();
const { body, validationResult } = require('express-validator');

var isloggedin=false;
//Router:1 Admin signup
router.post('/adminsignup',
[
    body('name',"Please enter valid mail").isLength({min:3}),
    body('email',"Please enter valid mail").isEmail(),
    body('password',"Please enter valid password").exists()
]
,async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.json({errors});
    }
    try{
        const admin= await Admin.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        }).then(()=>res.status(200).send("Admin has been registered")).catch((error)=>res.status(400).send("something went wrong"))
    }
    catch(error){
        res.status(400).send("Internal error");
    }
})
//Router:2 Admin login
router.post('/adminlogin',
[
    body('email',"Please enter valid mail").isEmail(),
    body('password',"Please enter valid password").exists()
]
,async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.json({errors});
    }
    try{
      const findadmin= await Admin.find({email:req.body.email});
      if(!findadmin){
        return res.status(400).send("Email or password is wrong")
      }
      const getpass= await Admin.find({email:req.body.email}).select("password").then().catch((error)=>console.log(error));
       if(req.body.password==getpass.at(0).password){
        res.status(200).send("Welcome Admin")
        isloggedin=true;
      }

    }
    catch(error){
        res.status(400).send("Internal error");
    }
})







module.exports=router;



