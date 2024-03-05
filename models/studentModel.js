const mongoose = require("mongoose");

//student schemas
const studentSchema = mongoose.Schema({
    name:{
        type :String,
        require:true
    },
    email:{
        type :String,
        require:true
    },
    age:{
        type :Number,
        require:true,
        min: 12
    },
    password:{
        type :String,
        require:true
    }

},{timestamps: true})

const studentModel = mongoose.model("students", studentSchema);

module.exports = studentModel;

