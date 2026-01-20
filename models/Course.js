import mongoose from "mongoose";

const courseSchema= new mongoose.Schema({
    courseName:{
        type:String,
        trim:true,
        required:true,
    },
    courseDescription:{
        type:String,
        trim:true,
        required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requried:true,
    },
    whatYouWillLearn:{
        type:String,
        trim:true,
        required:true,
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",

        }

    ],
    price:{
        type:Number,
        requried:true,
        trim:true,
    },
    thumbnail:{
        type:String,

    },
    tag:{
        type:mongoose.Schema.Type.ObjectId,
        ref:"Tag",
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            requrired:true,
        },

    ]


})

export const Course= mongoose.model("Course",courseSchema);


