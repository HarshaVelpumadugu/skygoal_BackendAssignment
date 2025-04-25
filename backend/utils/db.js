import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectToMongoDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB Successfully");
    }
    catch(error){
        console.log("Error while Connecting to MongoDB",error.message);
    }
};
export default connectToMongoDB;
