import Course from '../models/Course.js';
import Tag from '../models/Tags.js';
import User from '../models/User.js';
import { uploadImageToCloudinary } from '../utils/imageUploader.js';

// createCourse handler function
export const createCourse= async (req, res)=>{
    try{
        // Fetch data
        const {courseName, courseDescripiton, whatYourWilllearn, price, tag}= req.body;

        // get thumble
        const thumbnail= req.files.thumbnailImage;


        // validation, Instructor and tag level validation 
        if(!courseName || !courseDescripiton || !whatYourWilllearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fileds are required..",
            })
        }
        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ",instructorDetails);
        // TODO: Verify that userId and instructorDetails._id are same or different ?

        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor Details not found",
            })
        }
        // Check given tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(500).json({
                success:false,
                message:"Tag detaild not found",
            })
        }
        // upload to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // store data in db, for new course
        const newCourse=await Course.create({
            courseName,
            courseDescripiton,
            instructor: instructorDetails._id,
            whatYourWilllearn:whatYourWilllearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        // add the new course the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new: true},
        );

        // Update the tag schema
        await User.findByIdAndUpdate(
            tagDetails._id,
            {
                $push:{
                    courses: newCourse._id,
                }
            }

        )
        
        // retrun response 
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Tag creation error in controller tag.js",
        })
    }
}


// getAllCourses handler function

export const showAllCourses=async (req, res)=>{
    try{
        // TODO: Task complete
        // const allCourses= await Course.find(
        //     {},
        //     {
        //         courseName:true, 
        //         price:true, 
        //         thumbnail:true,
        //         instructor:true,
        //         ratingAndReviews:true,
        //         studentsEnrolled:true,
        //     }).populate("instructor")
        //     .exec();
        
        const allCourses=await Course.find({});
        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot Fetch course data",
            error:error.message,
        })
    }
}
