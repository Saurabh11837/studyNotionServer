import mongoose from "mongoose";

const ratingAndReviews= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    rating:{
        type:Number,
        required:true,
        trim:true,

    },
    review:{
        type:String,
        required:true,
    }
})

export const RatingAndReview= mongoose.model("RatingAndReview",ratingAndReviews);


