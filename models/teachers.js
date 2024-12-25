import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [20, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  userId: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  dob: {
    type: Date,
    required: [true, 'Date of Birth is required'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other'],
  },
  blood: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
  },
  father_name: {
    type: String,
    required: [true, 'Father\'s name is required'],
    minlength: [3, 'Father\'s name must be at least 3 characters long'],
    maxlength: [50, 'Father\'s name cannot exceed 50 characters'],
  },
  mother_name: {
    type: String,
    required: [true, 'Mother\'s name is required'],
    minlength: [3, 'Mother\'s name must be at least 3 characters long'],
    maxlength: [50, 'Mother\'s name cannot exceed 50 characters'],
  },
  father_mobile: {
    type: String,
    required: [true, 'Father\'s mobile number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
  },
  mother_mobile: {
    type: String,
    required: [true, 'Mother\'s mobile number is required'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
  },
  current_address: {
    type: String,
    required: [true, 'Current address is required'],
  },
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', TeacherSchema);
export default Teacher;
