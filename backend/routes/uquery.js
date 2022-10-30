const express=require('express');
const mongoose=require('mongoose')
const Users=require('../models/Users');
const Orders=require('../models/Orders');
const Admin=require('../models/Admin');
const UserquerySchema=require('../models/Userquery');
const jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser')
const JWT_SECRET='madebykrutik'
const bcrypt=require('bcrypt');
const fs=require('fs');
const path=require('path');
const router=express.Router();
const { body, validationResult } = require('express-validator');

//Router-1:Raise new query
router.post('/newquery',fetchuser,
[
    body('name',"Please select the waste type").exists(),
    body('description',"Please enter the waste amount").isLength({min:5}),
],
fetchuser,async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.json({errors});
    }
    try{
        const myquery= await UserquerySchema.create({
            user:req.users.id,
            name:req.body.name,
            description:req.body.description
        }).then(()=>res.status(200).send("Your query has been submitted successfully")).catch((error)=>res.status(400).json({error}));

    }
    catch(error){
        return res.status(500).send(error.message);
    }
})

//Router:2 Get all query of user
router.get('/myquery',fetchuser,
fetchuser,async (req,res)=>{
    try{
        const data=await UserquerySchema.find({user:req.users.id}).then((data)=>res.status(200).json({data})).catch((error)=>res.status(400).json({error}))

    }
    catch(error){
        return res.status(500).send(error.message);
    }
})
module.exports=router