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


app.use(cors({

    origin :["https://sharethink-blog.vercel.app"],
    methods:["GET", "POST", "UPDATE" ,"DELETE"],
    credentials:true
}
))
app.use(bodyParser.json())

mongoose.connect((process.env.URL)).then(()=>{
    console.log("db is connected")
}).catch((e)=>{
    console.log("db is not connect")
})


app.post("/signup",async (req,res)=>{
    const {userid,email,password,cpassword} = req.body;
    
    if(!userid || !email || !password || !cpassword){
    
return res.json({msg:"fill the all field"})
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
        return res.json({status:false,msg:"password is not same"})
    }
    return res.json({msg:"userid already taken"})
}
    return res.json({msg:"email already axist"})

    
    
    } catch (error) {
      
        return res.json({msg:"user id is short",error})
        
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
        return res.json({msg:"fill the all field"})
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
        return res.json({msg:"password is wrong"})

    }
                return res.json({msg:"please create user id"})

   } catch (error) {
    return res.json({msg:"something went wrong"})
    
   }
        
        })


app.get("/get",async (req,res)=>{

try {



    
   const allpost=  await loginpost.find();
   if(allpost){

       return res.json(allpost)
   }
   return res.json({msg:"not post get"})
    
} catch (error) {
    
}
})



app.put("/update/:id", async (req,res)=>{
    // const {email,post}  = req.body

    try {
        const id = req.params.id
const check =await loginpost.findById(id)


if(check){

const updatedata =await loginpost.findByIdAndUpdate(id,req.body,{new:true})
console.log(updatedata)

return res.json("update")


}
    } catch (error) {
return res.json("error")
        
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
return res.json({msg:"user invalid"})
    }
return res.json({msg: "not a wright user"})
}
return res.json({msg: "user is not register"})

    } catch (error) {
return res.json("error".error)
        
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
        user: (process.env.EMAIL),
        pass: (process.env.AUTH),
      }
    });

    var mailOptions = {
          from: `${(process.env.EMAIL)}`,
          to:email,
          subject: 'forget your passowrd',
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
                        return res.json({msg:"plese check email id"})
                    }

                    try {
    if(random==otp){
        console.log("success")
      
        return res.json({status:"user",send:check.id})
      
    }
    else{

      return  res.json({msg:"otp is missing"})
    }
} catch (error) {
    return res.json({msg:"email is not adding"})
    
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

    return res.json({msg:"user not found heh"})
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
return res.json({msg:"user not found hello"})
    
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
    return res.json({msg:"not a user"})
}
})


app.listen((process.env.PORT),()=>{
    console.log("server is running on port",process.env.PORT)
})



