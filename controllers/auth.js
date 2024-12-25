import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";
import Student from "../models/students.js";
import Teacher from "../models/teachers.js";
import transporter from "../mailer/email.js";
import { currentSession } from "../datetime.js";

const generateUserId = (prefix) => `${prefix}@${uuidv4().split("-")[0]}`;

const hashPassword = async (userId) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(userId, salt);
};

const sendRegistrationEmail = async (email, userId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Registration Successful",
    text: `Your user ID is ${userId} and password is ${userId}. Please keep it safe.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (emailErr) {
    console.error("Error sending email:", emailErr);
  }
};


const registerStudent = async (req, res) => {
  const {
    name,
    email,
    dob,
    gender,
    blood,
    mobile,
    father_name,
    mother_name,
    father_mobile,
    mother_mobile,
    current_address,
    Class,
  } = req.body;

  try {
    const userId = generateUserId("stu");
    const hashedPassword = await hashPassword(userId);
    const session = currentSession;

    const NewStudent = new Student({
      name,
      email,
      userId,
      password: hashedPassword,
      dob,
      gender,
      blood,
      mobile,
      father_name,
      mother_name,
      father_mobile,
      mother_mobile,
      current_address,
      Class,
      session,
    });

    const NewUser = new User({
      userId,
      email,
      password: hashedPassword,
      userType: "student",
    });

    await Promise.all([NewUser.save(), NewStudent.save()]);

    // await sendRegistrationEmail(email, userId);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      userId,
    });
  } catch (err) {
    console.error("Error registering student:", err);

    if (err.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors,
      });
    } else if (err.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Mobile number or email already registered",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};

const registerTeacher = async (req, res) => {
  const {
    name,
    email,
    dob,
    gender,
    blood,
    mobile,
    father_name,
    mother_name,
    father_mobile,
    mother_mobile,
    current_address,
  } = req.body;

  try {
    const userId = generateUserId("emp");
    const hashedPassword = await hashPassword(userId);

    const NewTeacher = new Teacher({
      name,
      email,
      userId,
      password: hashedPassword,
      dob,
      gender,
      blood,
      mobile,
      father_name,
      mother_name,
      father_mobile,
      mother_mobile,
      current_address,
    });

    const NewUser = new User({
      userId,
      email,
      password: hashedPassword,
      userType: "teacher",
    });

    await Promise.all([NewUser.save(), NewTeacher.save()]);

    await sendRegistrationEmail(email, userId);

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      userId,
    });
  } catch (err) {
    console.error("Error registering teacher:", err);

    if (err.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors,
      });
    } else if (err.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Mobile number or email already registered",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};

const login = async (req, res) => {
  const { userId, password, remember } = req.body;
  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(400).json({ error: "Invalid user " });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid user ID or password" });
    }

    let token;
    let cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    if (remember) {
      cookieOptions.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET
    );
    const userType = user.userType;
    res.cookie("token", token, cookieOptions);
    res
      .status(200)
      .json({ success: true, userType, message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getuser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id).select("-password -_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userType === "student") {
      const student = await Student.findOne({ userId: user.userId }).select(
        "-password -_id"
      );
      return res.json({ user, student });
    } else {
      const teacher = await Teacher.findOne({ userId: user.userId }).select(
        "-password -_id"
      );
      return res.json({ user, teacher });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const ResetpasswordEmail = async (email, userId, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password",
    text: `Your user ID is ${userId} and password reset link is ${resetLink} . Please keep it safe.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (emailErr) {
    console.error("Error sending email:", emailErr);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).select("userId email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
  
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await ResetpasswordEmail(user.email, user.userId, resetLink);

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
    
};

const resetPassword  = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ userId: decoded.userId }, { password: hashedPassword });

    return res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.user.id;
  try {
    const getUser = await User.findById(id);

    if (!getUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const deleteUser = await User.deleteOne({ _id: id });

    if (deleteUser.deletedCount === 0) {
      return res.status(400).json({ message: "Delete failed" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

function logout(req, res) {
  res.clearCookie("_csrf");
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}

export { registerStudent, registerTeacher, login, getuser, deleteUser, logout, resetPassword, forgetPassword };
