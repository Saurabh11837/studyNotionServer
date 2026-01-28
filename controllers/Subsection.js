import { SubSection } from "../models/SubSection.js";
import { Section } from "../models/Section.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";


// Create SubSection
export const createSubSection=async (req,res)=>{
    try{
        // fetch data from req body
        const {sectionId, title, timeDuration, descripition}=req.body;
        // extract file/video
        const video=req.files.videoFile;
        // validataion
        if(!sectionId || !title || !timeDuration ||! descripition || !video){
            return res.status(400).json({
                success:true,
                message:"All field required...",
            })
        }
        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        // create a sub-section
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            descripition:descripition,
            videoUrl:uploadDetails.secure_url,
        })
        // updatae section with this sub section ObjectId
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $push:{
                subSection:SubSectionDetails._id,
                },
            },
            {new:true},
        )
        .populate("subSection")

        console.log("Updated Section: ", updatedSection);
        // TODO : log updated section here, after adding populate query
        // return response
        return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            updatedSection,
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error while creating subsection",
        });
    }
}

//TODO : updateSubSection

// TODO : deleteSubSection

