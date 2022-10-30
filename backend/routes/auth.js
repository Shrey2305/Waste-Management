const express=require('express');
const mongoose=require('mongoose')
const Users=require('../models/Users');
const jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser')
const JWT_SECRET='madebykrutik'
const bcrypt=require('bcrypt');
const router=express.Router();
const { body, validationResult } = require('express-validator');
//Router:-1 signup to the app
router.post('/signup',
[
    body('name',"Please enter valid name").isLength({min:3}),
    body('email',"Please enter valid email").isEmail(),
    body('phone',"Please enter valid phone number").isMobilePhone(),
    body('password',"Please enter valid password with minimum length 6").isLength({min:6})
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.json({errors});
    }
    try{
        const salt=await bcrypt.genSalt(10);
        const secpass=await bcrypt.hash(req.body.password,salt);
        let user=await Users.findOne({email:req.body.email});
        if(user){
            res.status(400).send("already registered email");
        }
        let data= await Users.create({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:secpass
        });
        const jwtst={
            users:{
            id:data.id,
            }
        }
        const authtoken=jwt.sign(jwtst,JWT_SECRET);
        res.json({authtoken});
    }
    catch(error){
        res.status(400).send("Internal error" + error);  
    }
}
);
//Router:-2 login to the app
router.post('/login',
[
    body('email',"Please enter valid email").exists(),
    body('password',"Please enter valid password with minimum length 6").exists()
],
async (req,res)=>{
    const errors=validationResult(req);
    console.log("aaa")
    if(!errors.isEmpty()){
        res.json({errors});
    }
    try{
        //finding the user
        let getuser=await Users.findOne({
            email:req.body.email
        })
        if(!getuser){
            res.send("please register to our app")
        }
        //comparing the password
        const passcheck=await bcrypt.compare(req.body.password,getuser.password);
        if(!passcheck){
            res.send("please enter valid password");
        }
        const jwtst={
            users:{
                id:getuser.id,
            }
            
        }
        const authtoken=jwt.sign(jwtst,JWT_SECRET);
        res.json({authtoken});
    }
    catch(error){
        res.status(400).send("Internal error");
    }
}
);

//Router:3 Getting user details from authtoken
router.post('/getuser',fetchuser,
async (req,res)=>{
try{
  const userid=req.users.id;
  console.log(userid);
  const data=await Users.findById(userid).select("-password");
  res.json({data});
}catch(error){
 console.log(error.message);
 console.log("error occured in auth")
  res.status(500).json({error});
}
});
module.exports=router;