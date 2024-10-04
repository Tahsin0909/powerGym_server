const express = require('express');
const router = express.Router();
const Class = require('../schema/classSchema');

// Route for adding a new class with a date limit of 5 classes per day
router.post('/', async (req, res) => {
    const { date } = req.body;

    try {
        // Count how many classes already exist on the same date
        const classCount = await Class.countDocuments({ date });

        // Limit the number of classes to 5 per day
        if (classCount >= 5) {
            return res.status(400).json({ success: false, message: "Cannot add more than 5 classes on the same day" });
        }

        // Create and save a new class
        const newClass = new Class(req.body);
        await newClass.save();

        res.status(201).json({ success: true, message: "Class added successfully", data: newClass });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Route for fetching all classes
router.get('/', async (req, res) => {
    try {
        const classData = await Class.find();
        res.status(200).json({ success: true, data: classData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Route for fetching classes by date
router.get('/:date', async (req, res) => {
    const { date } = req.params;

    try {
        const classData = await Class.find({ date });

        if (classData.length === 0) {
            return res.status(404).json({ success: false, message: 'No classes found for this date' });
        }

        res.status(200).json({ success: true, data: classData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Route for fetching classes by trainer's name
router.get('/trainer/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const classData = await Class.find({ 'trainer.name': name });

        if (classData.length === 0) {
            return res.status(404).json({ success: false, message: 'No classes found for this trainer' });
        }

        res.status(200).json({ success: true, data: classData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Route for fetching classes by trainee's email
router.get('/trainee/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const classData = await Class.find({ trainee: email });

        if (classData.length === 0) {
            return res.status(404).json({ success: false, message: 'No classes found for this trainee' });
        }

        res.status(200).json({ success: true, data: classData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Route for trainee to join a class with validation for time conflicts
router.post('/join/:classId', async (req, res) => {
    const { classId } = req.params;
    const { email } = req.body;

    try {
        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        if (classData.trainee.length >= 10) {
            return res.status(400).json({ success: false, message: 'Class is full. Maximum limit of 10 trainees reached' });
        }

        if (classData.trainee.includes(email)) {
            return res.status(400).json({ success: false, message: 'Trainee is already in this class' });
        }

        const existingClasses = await Class.find({ date: classData.date, trainee: email });
        const isTimeConflict = existingClasses.some(existingClass =>
            existingClass.time.some(timeSlot => classData.time.includes(timeSlot))
        );

        if (isTimeConflict) {
            return res.status(400).json({ success: false, message: 'Trainee is already enrolled in another class at the same time on this date' });
        }

        classData.trainee.push(email);
        const updatedClass = await classData.save();

        res.status(200).json({ success: true, message: 'Trainee successfully added to the class', data: updatedClass });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Route for adding a trainee to a class (with limit and duplicate checking)
router.post('/:id', async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        const classData = await Class.findById(id);

        if (!classData) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        if (classData.trainee.length >= 10) {
            return res.status(400).json({ success: false, message: 'Class trainee limit reached (10 trainees)' });
        }

        if (classData.trainee.includes(email)) {
            return res.status(400).json({ success: false, message: 'Trainee is already registered for this class' });
        }

        classData.trainee.push(email);
        const updatedClass = await classData.save();

        res.status(200).json({ success: true, message: 'Trainee successfully added to the class', data: updatedClass });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;
