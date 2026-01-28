import { Section } from "../models/Section.js";
import { Course } from "../models/Course.js";   

export const createSection = async (req, res)=>{
    try{
        // data fetch
        const {sectionName, courseId}= req.body;

        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing prooerties",
            });
        }
        // create section
        const newSection= await Section.create({sectionName});
        // TODO: Use populate to replace section/sub-sections both in the updatedCourseDetails
        // update course with section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                },
            },
            {new:true},
        ).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        })
        .exec();

        // return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully in controller section.js",
            updatedCourseDetails,
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Unable to create suction, Occured error in controller section.js",
        })
    }
}

export const updateSection=async (req,res)=>{
    try{
        // data input
        const {sectionName, sectionId}=req.body;

        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing properyt",
            })
        }
        // update Data
        const section = await findByIdAndUpdate(sectionId, {sectionName}, {new:true})
        // {new:true} -> Update ke baad wala document return karo., iske bina data updata to ho jayega but print karega purana/old data hi..

        // return response
        return res.status(200).json({
            success:true,
            message:"Section Updated successfully ",
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Unable to updated data , Occured error in controller section.js",
        })
    }



}


export const deleteSection = async (req,res)=>{
    try{
        // get ID- assuming that we are sending id in parms
        const {sectionId}=req.params;
        const {courseId}=req.body;
        // use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        // TODO: do we need to delete the entry from the coursse schema ?
        // remove section reference from course
        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull:{
                    courseContent:sectionId,
                },
            },
            {new:true}
        );
        // return response
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully..",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occurred while deleting section",
        })
    }
}