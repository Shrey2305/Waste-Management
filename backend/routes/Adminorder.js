const express=require('express');
const Orders=require('../models/Orders');
const fetchdeliveryworker=require('../middleware/fetchdeliveryworker')
const Deliveryworkername=require('../models/Deliveryworkername');
const router=express.Router();
const { body, validationResult } = require('express-validator');

//Router-1:get all the orders of users
router.get('/getorder' ,async (req,res)=>{
    try{
        const allorder=Orders.find().select("-_id").select("-__v").then((allorder)=>res.status(200).json({allorder})).catch((error)=>res.status(400).json({error}));
      }
      catch(error){
          res.status(400).send("Internal error");
      }
})
//Router-2:give info of delivery guy to user orders
router.post('/givedelinfo/:orderid' ,[
    body('deliveryworkername',"Please enter valid name").exists(),
    body('deliveryworkerpn',"Please enter valid phone number").isMobilePhone()
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.json({errors});
    }
    try{
        //assigb deloivery info to user order
        const data=await Orders.findByIdAndUpdate(req.params.orderid,{$set:{deliveryworkername:req.body.deliveryworkername,deliveryworkerpn:req.body.deliveryworkerpn}}).then(async ()=>{
            const updateddata=Orders.findById(req.params.orderid).then(async (updateddata)=>{
                console.log(updateddata);
                if(updateddata.wastetype=="organicwaste"){
                    const updateuserstates= await Deliveryworkername.find({phone:req.body.deliveryworkerpn}).update({ $inc:{nooforganicwaste:1,amountofwaste:updateddata.amount,nooforders:1,amountoforganicwaste:updateddata.amount}}).then(()=>res.status(200).send("Reported")).catch((error)=>res.status(400).json({error}));
                }
                else if(updateddata.wastetype=="hazardouswaste"){
                    const updateuserstates=await Deliveryworkername.find({phone:req.body.deliveryworkerpn}).update({ $inc:{noofhazardouswaste:1,amountofwaste:updateddata.amount,nooforders:1,amountofhazadouswaste:updateddata.amount}}).then(()=>res.status(200).send("Reported")).catch((errors)=>res.status(400).json({errors}));
                }
                else if(updateddata.wastetype=="solidwaste"){
                    const updateuserstates= await Deliveryworkername.find({phone:req.body.deliveryworkerpn}).update({ $inc:{noofsolidwaste:1,amountofwaste:updateddata.amount,nooforders:1,amountofsolidwaste:updateddata.amount}}).then(()=>res.status(200).send("Reported")).catch((errors)=>res.status(400).json({errors}));
                }
                else if(updateddata.wastetype=="liquidwaste"){
                    const updateuserstates= await Deliveryworkername.find({phone:req.body.deliveryworkerpn}).update({ $inc:{noofliquidwaste:1,amountofwaste:updateddata.amount,nooforders:1,amountofliquidwaste:updateddata.amount}}).then(()=>res.status(200).send("Reported")).catch((errors)=>res.status(400).json({errors}));
                }
                else if(updateddata.wastetype=="recyclablewaste"){
                    const updateuserstates=  await Deliveryworkername.find({phone:req.body.deliveryworkerpn}).update({ $inc:{noofrecyclablewaste:1,amountofwaste:updateddata.amount,nooforders:1,amountofrecyclablewaste:updateddata.amount}}).then(()=>res.status(200).send("Reported")).catch((errors)=>res.status(400).json({errors}));
                }
            }).catch((error)=>res.status(400).send("something went wrong"));
            
    }).catch((error)=>res.status(400).json("Soemthing went wromng")) 
      }
      catch(error){
          res.status(400).send("Internal error");
      }
})

module.exports=router;