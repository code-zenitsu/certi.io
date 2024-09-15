
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Certificate = require('../models/Certificate');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const row of data) {
            const certificate = new Certificate({
                certificateId: row.certificateId,
                studentName: row.studentName,
                internshipDomain: row.internshipDomain,
                startDate: new Date(row.startDate),
                endDate: new Date(row.endDate)
            });
            await certificate.save();
        }

        res.status(200).send('File uploaded and data saved successfully.');
    } catch (error) {
        res.status(500).send('Error uploading file and saving data.');
    }
});

router.get('/:certificateId', async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
        if (!certificate) {
            return res.status(404).send('Certificate not found.');
        }
        res.status(200).json(certificate);
    } catch (error) {
        res.status(500).send('Error retrieving certificate.');
    }
});

module.exports = router;
