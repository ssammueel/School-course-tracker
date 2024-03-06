const express = require("express")
const mongoose =  require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

// importing model
const studentModel = require("./models/studentModel")
const courseModel = require("./models/courseModel")
const checkToken = require("./chectToken");
const trackingModel = require("./models/trackingModel")

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
                            res.send({message:"log in sucessful", token:token})// user should not see his token
                        }
                    })
                }
                else{
                    res.send({message:"wrong password please attempt again"})
                }
            })
        }else
        {
            res.send({message:"email not found"})
        }
    }
    catch(err){
        console.log(err);
        res.send({message:"you got a problem in log-in"})
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
app.get("/courses/:code", checkToken, async (req, res) => {
    try {
        let courses = await courseModel.find({ code: { $regex: req.params.code, $options: "i" } });
        if (courses.length !== 0) {
            res.send(courses);
        } else {
            res.send("Course not found");
        }
    } catch (err) {
        console.log(err);
        res.send({ message: "There was an error" });
    }
});

//tracking all courses

app.post("/track",checkToken,async (req,res)=>{
    let data = req.body;

    try{
        let adde = await trackingModel.create(data)
        res.send({message:"data sucessful addes", add:adde})
    }
    catch(err)
    {
        console.log(err)
        res.send("problem in creating adding data to model")
    }
})

// tracking dourses taken by a student 
app.get("/track/:studentid",checkToken ,async (req,res)=>{
    let studentid = req.params.studentid

    try {
        let data = await trackingModel.find({studentId:studentid}).populate("studentId").populate("courseId")
        res.send(data)
    }
    catch (err) {
        console.log(err)
        res.send("some issue in tracking the user id")
    }
})


app.listen(8000, ()=>{
    console.log("server up and running")
})
