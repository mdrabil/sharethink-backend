import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        unique:true,
       "minLength":5
    },
    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true,
        
    },
    cpassword:{
        type:String,
        required:true,
    },
    Post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"loginpost"
    }]
 

})

export default mongoose.model("user",userschema)