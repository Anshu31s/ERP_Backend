import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import {logout, getuser, deleteUser } from '../controllers/auth.js';
import { getstudents, getNewStudents, getTeachers, updatestudent, updateTeacher, viewstudents, updateAvatar,getResult } from '../controllers/users.js';
import { uploadmarks } from '../controllers/score.js';
import {uploadattendance, getAttendance } from '../controllers/attendance.js';
import upload from '../middleware/multer.js';
import { uploadDocumentToS3 } from '../middleware/uploadAvatar.js';


const router = Router();

router.get('/getuser', authMiddleware, getuser);
router.delete('/deleteUser', authMiddleware, deleteUser);
router.post('/logout', authMiddleware, logout);

router.get('/get-students', getstudents);
router.get('/get-teachers', getTeachers);
router.get('/Get-new-students', getNewStudents);

router.post('/upload-marks', uploadmarks);
router.post('/upload-attendace', uploadattendance);
router.get('/get-attendance',authMiddleware, getAttendance);

router.post('/Update-student', updatestudent);
router.post('/Update-teacher', updateTeacher);

router.post('/update-avatar', authMiddleware, upload.single('avatar'),uploadDocumentToS3, updateAvatar);

router.get('/view-students', viewstudents);
router.get('/get-result',authMiddleware ,getResult);

export default router;