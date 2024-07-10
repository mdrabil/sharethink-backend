import mongoose from "mongoose";

const Postschema= new mongoose.Schema({

    userid:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    post:{
        type:String,
        required:true
    
    },
    email:{
        type:String
    },
      
coment:[
    {
        type : mongoose.Schema.Types.ObjectId,
        ref:"posted"
    }

]


})

export default mongoose.model("loginpost",Postschema)