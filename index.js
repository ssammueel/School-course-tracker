const express = require("express")
const mongoose =  require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

// importing model
const studentModel = require("./models/studentModel")
const courseModel = require("./models/courseModel")
const checkToken = require("./chectToken")

const app = express();
// conecting to db
mongoose.connect("mongodb://localhost:27017/Stud")
.then(()=>{
    console.log("database connected sucessfully")
})
.catch((err)=>{
    console.log(err)
})

// post request for register 

app.use(express.json());

app.post("/register",async (req,res)=>{

    let student = req.body; 

    bcrypt.genSalt(10, (err, salt)=>{
        if(!err){
            bcrypt.hash(student.password, salt, async (err, hpass)=>{
                if(!err){
                    student.password = hpass;
                    try{
                        let det = await studentModel.create(student)
                        res.send({message:"Student  Regstered"})
                    }
                    catch(err){
                        console.log(err)
                        res.send({message:"registration failed there is a problem"})
                    }
                }
            })
        }
    })
})

// log in 

app.post("/login",async (req,res)=>{
    const studentCred = req.body;

    try
    {
        let students = await studentModel.findOne({email:studentCred.email})
        if(students !== null)
        {
            bcrypt.compare(studentCred.password, students.password,  (err, correct)=>{
                if(correct == true){
                    jwt.sign({email:studentCred.email}, "studentApp", (err, token)=>{
                        if(!err){
                            res.send({message:"log in sucessful", token:token})
                        }
                    })
                }
                else{
                    res.send({message:"wrong password sor"})
                }
            })
        }else
        {
            res.send({message:"email not found"})
        }
    }
    catch(err){
        console.log(err);
        res.send({message:"you gor a problem in log-in"})
    }
    
})


// search  all the courses 
app.get("/courses", checkToken  , async(req,res)=>{

    try
    {
        let courses = await courseModel.find();
        res.send({message:"sucess in fetching all the courses", courses:courses})
    }
    catch(err){
        console.log(err)
        res.send({message:"there was some problem in fetching all courses"})
    }  
    
})

// search courses by code
app.get("/courses/:code",checkToken,async (req,res)=>{
    try{
        let courses = await courseModel.find({code:req.params.code})
        res.send(courses)
    }
    catch(err){
        console.log(err)
        res.send({message:"there was an error"})
    }
})



app.listen(8000, ()=>{
    console.log("server up and running")
})