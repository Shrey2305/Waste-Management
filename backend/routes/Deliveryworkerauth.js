const express=require('express');
const mongoose=require('mongoose')
const Deliveryworkername=require('../models/Deliveryworkername');
const jwt=require('jsonwebtoken');
const fetchdeliveryworker=require('../middleware/fetchdeliveryworker')
const JWT_SECRET='madebykrutik'
const bcrypt=require('bcrypt');
const router=express.Router();
const { body, validationResult } = require('express-validator');
//Router:-1 signup to the app
router.post('/signupdel',
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
        let user1=await Deliveryworkername.findOne({email:req.body.email});
        if(user1){
            res.status(400).send("already registered email");
        }
        let user2=await Deliveryworkername.findOne({phone:req.body.phone});
        if(user2){
            res.status(400).send("already registered email");
        }
        let data= await Deliveryworkername.create({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:secpass
        });
        const jwtst={
            Deliveryworkername:{
            id:data.id,
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
//Router:-2 login to the app
router.post('/logindel',
[
    body('email',"Please enter valid email").exists(),
    body('password',"Please enter valid password with minimum length 6").exists()
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.json({errors});
    }
    try{
        //finding the user
        let getuser=await Deliveryworkername.findOne({
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
            Deliveryworkername:{
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

//Route:3 getting details of deliveryworker from auth token
router.post('/getdel',fetchdeliveryworker,
async (req,res)=>{
try{
  const userid=req.Deliveryworkername.id;
  console.log(userid);
  const data=await Deliveryworkername.findById(userid).select("-password");
  res.json({data});
}catch(error){
 console.log(error.message);
 console.log("error occured in auth")
  res.status(500).json({error});
}
});
module.exports=router;