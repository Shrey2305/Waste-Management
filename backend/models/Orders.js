const mongoose=require('mongoose');
const {Schema} =mongoose;

const OrdersSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    wastetype:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    amount:{
        type:mongoose.Types.Decimal128,
        required:true
    },
    pdate:{
        type:String,
        required:true
    },
    ptime:{
        type:String,
        required:true
    },
    orderdate:{
        type:Date,
        default:Date.now()
    },
    deliveryworkername:{
        type:String,
        default:""
    },
    deliveryworkerpn:{
        type:Number,
        default:0
    }

})
module.exports=mongoose.model('Orders',OrdersSchema);