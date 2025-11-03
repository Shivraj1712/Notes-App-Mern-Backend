import mongoose from "mongoose";

const connetDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB is now conected : ${conn.connection.host}`);
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export default connetDB