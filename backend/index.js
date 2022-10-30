const connecttomongo=require('./db');
connecttomongo();
const express = require('express')
const app = express()
const port = 5000;


const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) 


app.use(express.json());
// ---------------------Routes of authentication-------------------------------------
app.use('/api/auth',require('./routes/auth'));  //this is user auth
app.use('/api/deliveryauth',require('./routes/Deliveryworkerauth'));
app.use('/api/admin',require('./routes/Adminauth'));
//-----------------------------------------------------------------------------------

//--------------------------Routes of orders-----------------------------------------
app.use('/api/orders',require('./routes/orders'));
app.use('/api/adminorder',require('./routes/Adminorder'));
app.use('/api/deliveryworkerorder',require('./routes/Deliveryworkerorder'));
//-----------------------------------------------------------------------------------

//--------------------------Routes of querys-----------------------------------------
app.use('/api/userquery',require('./routes/uquery'));
app.use('/api/adminquery',require('./routes/Adminquery'));
app.use('/api/deliveryquery',require('./routes/Deliveryworkerquery'));

   
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})              