const express=require('express');
const DeliveryquerySchema=require('../models/Deliveryquery');
const fetchdeliveryworker=require('../middleware/fetchdeliveryworker')
const router=express.Router();
const { body, validationResult } = require('express-validator');

//Router-1:Raise new query
router.post('/newquery',fetchdeliveryworker,
[
    body('name',"Please select the waste type").exists(),
    body('description',"Please enter the waste amount").isLength({min:5}),
],
fetchdeliveryworker,async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.json({errors});
    }
    try{
        const myquery= await DeliveryquerySchema.create({
            DWN:req.Deliveryworkername.id,
            name:req.body.name,
            description:req.body.description
        }).then(()=>res.status(200).send("Your query has been submitted successfully")).catch((error)=>res.status(400).json({error}));

    }
    catch(error){
        return res.status(500).send(error.message);
    }
})

//Router:2 Get all query of user
router.get('/myquery',fetchdeliveryworker,async (req,res)=>{
    try{
        const data=await DeliveryquerySchema.find({user:req.Deliveryworkername.id}).then((data)=>res.status(200).json({data})).catch((error)=>res.status(400).json({error}))

    }
    catch(error){
        return res.status(500).send(error.message);
    }
})
module.exports=router