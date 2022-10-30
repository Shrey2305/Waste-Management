const express=require('express');
const router=express.Router();
const Userquery=require('../models/Userquery');
const Deliveryquery=require('../models/Deliveryquery');
const { body, validationResult } = require('express-validator');

//Router-1:get all the user query
router.get('/getquery' ,async (req,res)=>{
    try{
        const userquery=await Userquery.find().select("-_id").select("-__v").then((userquery)=>res.status(200).json({userquery})).catch((error)=>res.status(400).json({error}));
        const delquery=await Deliveryquery.find().select("-_id").select("-__v").then((delquery)=>res.status(200).json({delquery})).catch((error)=>res.status(400).json({error}));
      }
      catch(error){
          res.status(400).send("Internal error");
      }
})

//Router-2:give answer of all user querys
router.post('/ansquery/:queryid',[
    body('answer','Answer should not be blank').exists(),
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.json({errors});
    }
    try{
        const findquery=await Userquery.findById(req.params.queryid);
        if(!findquery){
            const deldata= await Deliveryquery.findByIdAndUpdate(req.params.queryid,{$set:{answer:req.body.answer}}).then(()=>res.status(200).send("Query reported")).catch(()=>res.status(400).send("Something went wrong"));
        }
        else{
            const data=await Userquery.findByIdAndUpdate(req.params.queryid,{$set:{answer:req.body.answer}}).then(()=>res.status(200).send("Query reported")).catch(()=>res.status(400).send("Something went wrong"));
        }
        
       
           
    }
    catch(error){
        res.status(400).send("Internal error");
    }
})

module.exports=router;