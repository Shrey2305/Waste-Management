const mongoose=require('mongoose');
const {Schema} =mongoose;

const UserquerySchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
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

module.exports=mongoose.model('Userquery',UserquerySchema);