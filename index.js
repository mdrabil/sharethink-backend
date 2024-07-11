import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors'
import nodemailer from 'nodemailer'
import validate from 'email-validator'
import  configDotenv  from "dotenv";
import express from 'express'
import User from './models/schema.js'
import loginpost from './models/postschema.js'

configDotenv.config();
import bcrypt from 'bcryptjs'

const app = express()

app.get('/',(req,res)=>{
    res.send("this is backend point")
})
app.use(cors(
    {

    origin :["https://mdrabilblogs.vercel.app"],
    methods:["GET", "POST", "PUT" ,"DELETE"],
    credentials:true
}
))
app.use(bodyParser.json())



mongoose.connect(process.env.URL).then(()=>{
    console.log("db is connected")
}).catch((e)=>{
    console.log("db is not connect")
})


app.get('/',(req,res)=>{
    res.send("hello")
})

app.post("/signup",async (req,res)=>{
    const {userid,email,password,cpassword} = req.body;

    if(!userid || !email || !password || !cpassword){
    
return res.json({msg:"FILL THE ALL FIELD"})
      }
    const hashpass = await bcrypt.hash(password,10)


    const data ={
        userid:userid,
        email:email,
        password:hashpass,
        cpassword:hashpass
    }

    try {
        const check =await User.findOne({email:email})
        

    if(!check){
        const checkuser =await User.findOne({userid:userid})

    if(!checkuser){

        if(password==cpassword){
            const getdata = await User.create(data)
            
            const saved = await getdata.save()
           
            return res.json("add")
            
            
        }
        return res.json({status:false,msg:"PASSWORD NOT MATCHING"})
    }
    return res.json({msg:"USER ID TAKEN"})
}
    return res.json({msg:"EMAIL IS ALREADY EXIST"})

    
    
    } catch (error) {
      
        return res.json({msg:"SERVER ERROR TO SIGN",error})
        
    }
    
})

// app.post("/login",async (req,res)=>{
//     const {email,password} = req.body;
    
    
//     try {
//         const check =await User.findOne({email:email})
        
        
//         if(check){
            
            
// const checkpass= await bcrypt.compare(password,check.password)
            
            
//               if(checkpass){

        
                  
            
//             return res.json("added")
            
//         }
        
   
// return res.json({msg:"password is not matching"})
//         }
//         return res.json({msg:"user is not register"})
        
        
        
//         } catch (error) {
//        return res.json({msg:"user not found"})
            
//         }
        
//         })
        



app.post("/post",async (req,res)=>{
    const {userid,password,post} = req.body ;
    if(!userid || !password || !post){
        return res.json({msg:"FILL THE ALL FIELD"})
    }
    
   try {
    const check = await User.findOne({userid:userid})
    if(check){
        const checkpassword = await bcrypt.compare(password,check.password)
        if(checkpassword){
            const hashpass = await bcrypt.hash(password,10)
            const data = {
                userid:userid,
                password:hashpass,
                post:post,
                email:check.email
            }
            const gatdata= await loginpost.create(data)
    
           const saved = await gatdata.save()
        return res.json("added")


        }
        return res.json({msg:"INCORRECT PASSWORD"})

    }
                return res.json({msg:"INVALID USER"})

   } catch (error) {
    return res.json({msg:"SERVER ERROR TO POST"})
    
   }
        
        })


app.get("/get",async (req,res)=>{

try {



    
   const allpost=  await loginpost.find();
   if(allpost){

       return res.json(allpost)
   }
   return res.json({msg:"USER NOT FOUND"})
    
} catch (error) {
    
}
})



app.put("/update/:id", async (req,res)=>{
    const {post} = req.body ;

    try {
        const id = req.params.id
const check =await loginpost.findById(id)


if(check){

const dataupdate =await loginpost.findByIdAndUpdate({_id:id},req.body,{new:true})
return res.json("update")


}
    } catch (error) {
return res.json("SERVER ERROR TO UPDATE")
        
    }
})
app.post("/verifypassword/:id", async (req,res)=>{
    const {userid,password} = req.body
    try {
    const id = req.params.id
    const check =await loginpost.findById(id)
    
    
    if(check){

       if(userid==check.userid ){
        const checkpassowrd = await bcrypt.compare(password,check.password)
if(checkpassowrd){

    return res.json("pass")
}
return res.json({msg:"INVALID USER"})
    }
return res.json({msg: "INVALID USER"})
}
return res.json({msg: "HACKER "})

    } catch (error) {
return res.json("SERVER ERROR TO USER".error)
        
    }
})


app.get("/getone/:id", async (req,res)=>{
    try {
        const id = req.params.id ;

const check = await loginpost.findById(id)

if(check)
    {
        
        return res.json(check)
        
    }

        return null
    } catch (error) {


        
    }
})

app.delete('/delete/:id', async(req,res)=>{
    try {
        const id = req.params.id ;

const check = await loginpost.findById(id)

if(check)
    {
        const deletedata= await loginpost.findByIdAndDelete(id)
        return res.json("delete")
        
    }

        return null
    } catch (error) {


        
    }
})


app.post('/generate-otp', async (req,res)=>{
    const {email} = req.body;
    
    
    const check = await User.findOne({email:email})
    
    if(!check){
        return res.json({status:false,msg:"PLEASE ENTER CORECT EMAIL"})
    }
else{
    
    try {
        const random = Math.floor(Math.random()*10000)

        res.json({status:true})
    
    
            var transporter = nodemailer.createTransport({
                  service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.AUTH,
      }
    });

    var mailOptions = {
          from: process.env.EMAIL,
          to:email,
          subject: 'FORGET PASSWORD OTP',
          text:`${random}`
        };
    
        transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                    console.log("error");
                  } else {
                        console.log('Email sent: ' ,random);
                      }
    })


                app.post('/forget-password',async (req,res)=>{
                    const {email,otp} = req.body
                    
                    const check = await User.findOne({email:email})
                    
                    if(!check){
                        return res.json({msg:"PLEASE CHECK YOUR EMAIL"})
                    }

                    try {
    if(random==otp){
        console.log("success")
      
        return res.json({status:"user",send:check.id})
      
    }
    else{

      return  res.json({msg:"OTP IS MISSING"})
    }
} catch (error) {
    return res.json({msg:"INVALID EMAIL"})
    
}



})

} catch (error) {
    return res.json({msg:"error"})
}
}

});


app.post('/reset-password/:id',async (req,res)=>{
    const {password,userid} = req.body
    const id = req.params.id

const check = await User.findById(id)
if(!check){

    return res.json({msg:"USER NOT FOUND"})
}
else{
    try {
        
        if(password){
            console.log("password khali nhi hai")
            const hashpass = await bcrypt.hash(password,10)
            
        await User.findByIdAndUpdate({_id:id},{password:hashpass})
        return res.json("user")
    }
    else{
        if(userid){

            console.log(check.userid)
            await User.findByIdAndUpdate({_id:id},{userid:userid})
        return res.json("user")

        }
  
        
        
    }
    
    
} catch (error) {
return res.json({msg:"SERVER ERROR TO RESET PASSWORD"})
    
}
}
})
app.post('/generate-otp/:id', async (req,res)=>{
    const {email,password} = req.body
    const id = req.params.id
const check = await loginpost.findById(id)

try {
    
if(email==check.email){
    const hashpass= await bcrypt.hash(password,10)
    console.log(hashpass)
    await loginpost.findByIdAndUpdate({_id:id},{password:hashpass})
    return res.json({status:true})
}

return res.json({msg:"INCORECT EMAIL "})
} catch (error) {
    return res.json({msg:"SERVER ERRROR TO GENERATE OTP"})
}
})


app.listen((process.env.PORT),()=>{
    console.log("server is running on port",process.env.PORT)
})



