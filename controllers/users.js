import User from "../models/user.js";
import Student from "../models/students.js";
import Teacher from "../models/teachers.js";
import Marks from "../models/marks.js";

const getstudents = async (req, res) => {
  try {
    const { page, limit, search, gender, active } = req.query;
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ active: true });

    const searchCriteria = {};
    if (search) {
      searchCriteria.name = { $regex: `^${search}`, $options: "i" };
    }
    if (gender) {
      searchCriteria.gender = gender;
    }
    if (active) {
      searchCriteria.active = active;
    }

    const students = await Student.find(searchCriteria)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      totalStudents,
      activeStudents,
      students,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getNewStudents = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    let yearlyData = [];

    for (let year = 2020; year <= currentYear; year++) {
      const startOfYear = new Date(year, 3, 1); // April 1st of the current year
      const endOfYear = new Date(year + 1, 2, 31, 23, 59, 59); // March 31st of the next year

      const newStudents = await Student.countDocuments({
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      });

      yearlyData.push({
        year: `${year} - ${year + 1}`,
        count: newStudents,
      });
    }

    res.status(200).json(yearlyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTeachers = async (req, res) => {
  try {
    const { page, limit, search, gender, active } = req.query;

    const totalTeachers = await Teacher.countDocuments();
    const activeTeachers = await Teacher.countDocuments({ active: true });

    const searchCriteria = {};
    if (search) {
      searchCriteria.name = { $regex: `^${search}`, $options: "i" };
    }
    if (gender) {
      searchCriteria.gender = gender;
    }
    if (active) {
      searchCriteria.active = active === "true";
    }

    const teachers = await Teacher.find(searchCriteria)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }

    res.status(200).json({
      totalTeachers,
      activeTeachers,
      teachers,
      currentPage: page,
      totalPages: Math.ceil(totalTeachers / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updatestudent = async (req, res) => {
  const { userId, ...changes } = req.body;
  try {
    const student = await Student.findOne({ userId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    Object.assign(student, changes);

    await student.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateTeacher = async (req, res) => {
  const { userId, ...changes } = req.body;
  try {
    const teacher = await Teacher.findOne({ userId });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    Object.assign(teacher, changes);

    await teacher.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const viewstudents = async (req, res) => {
  const { Class } = req.query;
  try {
    const searchCriteria = {};

    if (Class) {
      searchCriteria.Class = Class;
      searchCriteria.active = true;
    }

    const students = await Student.find(searchCriteria).select("-password");

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAvatar = async (req, res) => {
  const id = req.user.id;
  const avatar = req.body.documentUrl;

  try {
    const user = await User.findById(id).select("-password -_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.userType === "student") {
      const updateAvatar = await Student.updateOne(
        {
          userId: user.userId,
        },
        { avatar: avatar }
      );
    } else {
      const updateAvatar = await Teacher.updateOne(
        {
          userId: user.userId,
        },
        { avatar: avatar }
      );
    }
    res.status(200).json("successfully avatar updated...");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getResult = async (req, res) => {
  const id = req.user.id;
  console.log("🚀 ~ getResult ~ userId:", id);
  try {
    const user = await User.findById(id).select("-password -_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userType === "student") {
      const student = await Student.findOne({ userId: user.userId }).select(
        "-password -_id"
      );
     

      const getMarks = await Marks.findOne({class:student.Class,marks:student.userId})
      console.log("🚀 ~ getResult ~ getMarks:", getMarks)
      return res.json({ getMarks });
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

export {
  getstudents,
  getNewStudents,
  getTeachers,
  updatestudent,
  getResult,
  updateTeacher,
  viewstudents,
  updateAvatar,
};
