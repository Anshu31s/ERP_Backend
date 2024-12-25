import Mongoose from 'mongoose';

const localDB = `mongodb+srv://anshukiran24:J5A62v2WWx77iboQ@cluster0.swv4f.mongodb.net/erp_model?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await Mongoose.connect(localDB);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;