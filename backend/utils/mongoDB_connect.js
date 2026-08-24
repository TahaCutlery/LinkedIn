import mongoose from "mongoose";

const DBConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected!`);
    } catch (err) {
        console.log(err);
    }
}

export default DBConnect;