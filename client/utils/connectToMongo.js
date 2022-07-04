import mongoose from "mongoose";

const connectMongo = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log("Connecting to mongo");
    mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI);
  }
  console.log("Connected to mongo");
};

export default connectMongo;
