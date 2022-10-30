const mongoose=require('mongoose')
const mongouri="mongodb://localhost:27017/vow?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const connecttomongo=()=>{
    mongoose.connect(mongouri,()=>{
        console.log("connected to database");
    })
}
module.exports=connecttomongo;