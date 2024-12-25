import mongoose from 'mongoose';

const MarksSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
    enum: ["9", "10", "11", "12"],
  },
  subject: {
    type: String,
    required: true,
  },
  marks: {
    type: Map, 
    of: String,
  },
  examType: {
    type: String,
    required: true,
    enum: ["Half Yearly", "Final"],
  },
  stream: {
    type: String,
    enum: ["Science", "Commerce", "Arts"],
  },
}, { timestamps: true });


const Marks = mongoose.model('Marks', MarksSchema);
export default  Marks;
