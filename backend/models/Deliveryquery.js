const mongoose=require('mongoose');
const {Schema} =mongoose;

const DeliveryquerySchema=new Schema({
    DWN:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Deliveryworkername'
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        default:""
    }

})

module.exports=mongoose.model('Deliveryquery',DeliveryquerySchema);