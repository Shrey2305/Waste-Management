const jwt=require('jsonwebtoken');
const JWT_SECRET='madebykrutik';
const fetchdeliveryworker=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(500).send("please authecticate");
    }
    try{
        const data=jwt.verify(token,JWT_SECRET);
        req.Deliveryworkername=data.Deliveryworkername;
        console.log(data.Deliveryworkername);
        next();
    }
    catch(error){
        console.log(error.message);
        console.log("error occured in fetch user")
        res.status(500).json({error})
    }
}
module.exports=fetchdeliveryworker;