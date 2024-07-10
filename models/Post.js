import mongoose from "mongoose";

const mypost= new mongoose.Schema({

postdata:{
    type:String,

},

})

export default mongoose.model("posted",mypost)