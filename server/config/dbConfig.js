import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("connect successfully");
  } catch (error) {
    console.log("db connect is failed");
    throw new Error(error);
  }
};

export { dbConnect };
