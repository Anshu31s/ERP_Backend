import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, 'User ID is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  userType: {
    type: String,
    required: [true, 'Role is required'],
  },
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;