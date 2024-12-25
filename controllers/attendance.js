import Attendance from '../models/attendance.js';
import moment from 'moment';

const uploadattendance = async (req, res) => {
  const { class: className, stream, attendance } = req.body;

  if (!className || !attendance) {
    return res.status(400).json({ error: 'Class, date, and attendance are required.' });
  }

  if ((className === '11' || className === '12') && !stream) {
    return res.status(400).json({ error: 'Stream is required for classes 11 and 12.' });
  }

  const validStreams = ["Science", "Commerce", "Arts"];
  if (stream && !validStreams.includes(stream)) {
    return res.status(400).json({ error: 'Invalid stream value.' });
  }

  try {
    const newAttendance = new Attendance({
      class: className,
      stream: stream || undefined,
      attendance,
    });

    await newAttendance.save();
    res.status(200).json({ message: 'Attendance submitted successfully.' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ error: 'Failed to submit attendance.' });
  }

}

const getAttendance = async (req, res) => {
  try {
    const { userId, class: Class } = req.query;

    const startOfApril = moment().month(3).startOf('month').toDate();
    const endOfFebNextYear = moment().year(moment().year() + 1).month(1).endOf('month').toDate();


    const attendanceRecords = await Attendance.find({
      class: Class,
      createdAt: {
        $gte: startOfApril,
        $lte: endOfFebNextYear,
      },
    });

    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    attendanceRecords.forEach((record) => {
      // Check the attendance status for the specific student
      const studentAttendance = record.attendance.get(userId);
      if (studentAttendance === 'present') {
        presentCount++;
      } else if (studentAttendance === 'absent') {
        absentCount++;
      } else if (studentAttendance === 'N.A.') {
        leaveCount++;
      }
    });

    return res.status(200).json({
      attendance: {
        totalClasses: attendanceRecords.length,
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
        period: {
          start: startOfApril,
          end: endOfFebNextYear,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }

};


export { uploadattendance, getAttendance };

