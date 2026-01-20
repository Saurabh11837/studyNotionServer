import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose";

export const connctDatabase=async ()=>{

    try{
        if(!process.env.MONGODB.URI){
            throw new Error("MONGODB_URI is not defined in enviroment variables");

        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully");
    }   
    catch(err){
        console.log("Mongodb connection error:",err);
        process.exit(1);
    }
}