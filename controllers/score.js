import Marks from '../models/marks.js'

const uploadmarks = async (req, res) => {
    const { class: className, subject, marks, examType, stream } = req.body;
   
    if (!className || !subject || !marks) {
        return res.status(400).json({ error: 'Class, subject, and marks are required.' });
    }

    if ((className === '11' || className === '12') && !stream) {
        return res.status(400).json({ error: 'Stream is required for classes 11 and 12.' });
    }

    const validStreams = ["Science", "Commerce", "Arts"];
    if (stream && !validStreams.includes(stream)) {
        return res.status(400).json({ error: 'Invalid stream value.' });
    }

    try {
        const newMarks = new Marks({
            class: className,
            subject,
            marks,
            examType,
            stream: stream || undefined,
        });

        await newMarks.save();
        res.status(200).json({ message: 'Marks submitted successfully.' });
    } catch (error) {
        console.error('Error saving marks:', error);
        res.status(500).json({ error: 'Failed to submit marks.' });
    }
};

const getmarks = async (req, res) => {

}

export { uploadmarks, getmarks };

