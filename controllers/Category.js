import Category from '../models/Category.js';

// create handlere function
export const createCategory= async (req, res)=>{
    try{
        // fetch data
        const {name,description}=req.body;

        // validataion
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All field are required ",
            })
        }
        // create entry in DB
        const tagData= await Tag.create({
            name:name,
            description:description,
        });

        // retrun response
        return res.status(200).json({
            success:true,
            message:"Tag created Successfully..",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Tag creation error in controller tag.js",
        })
    }
}


// getAlltags handler function

export const showAllCategory= async (req,res)=>{
    try{
        const allCategory = await Category.find({}, {name:true, description:true});
        res.status(200).json({
            success:true,
            message:"All Category returned successfully",
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"All Category reqired error in controller Category.js",
        })
    }
}