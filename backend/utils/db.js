import { config } from 'dotenv';
import { mongoose } from 'mongoose';

config();


const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB: ", error);
        process.exit(1);
    }
};
export default connectToDb;
