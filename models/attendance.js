import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
    enum: ["9", "10", "11", "12"],
  },
  stream: {
    type: String,
    enum: ["Science", "Commerce", "Arts"],
  },
  attendance: {
    type: Map,
    of: String,
  },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);

export default Attendance;
