const  mongoose  = require("mongoose");

const courseSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    lecturer:{
        type:String,
        required:true
    },
    class:{
        type:String,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    }
},{timestamps:true})

const courseModel = mongoose.model("courses", courseSchema)

module.exports = courseModel;