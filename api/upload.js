const express = require('express');
const router = express.Router();
const multer = require('multer');
// https://github.com/SheetJS/sheetjs#parsing-workbooks
const XLSX = require('xlsx');

// https://github.com/expressjs/multer#diskstorage
let storage = multer.diskStorage({
    // https://github.com/expressjs/multer#file-information
    destination: (req, file, cb) => {
        console.log(file);
        console.log(__dirname);
        cb(null, `./public/uploads`)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } // file size max is 100mb
}).single('myxlfile'); // same  should be specifeid in name attribute of the input tag

router.route('/')

.post((req, res) => {
    upload(req, res, async(err) => {
        if (err) { console.log(err); }
        try {
            if (!req.file) { return res.status(400).json({ error: 'all fields are required' }); }
            console.log(req.file);
            // return res.status(200).send('ok');
            const xlfilepath = `./public/uploads/${req.file.filename}`;
            console.log(`./public/uploads/${req.file.filename}`);
            const workbook = XLSX.readFile(xlfilepath); // https://github.com/SheetJS/sheetjs#working-with-the-workbook
            // console.log(workbook);
            // return res.status(200).json(workbook);
            // https://github.com/SheetJS/sheetjs#parsing-options
            console.log(workbook.SheetNames); // https://github.com/SheetJS/sheetjs#working-with-the-workbook
            const firstSheetName = workbook.SheetNames[0];
            console.log(firstSheetName);
            const worksheet1 = workbook.Sheets[firstSheetName];
            // console.log(XLSX.utils.sheet_to_json(worksheet1));
            const xltojsondata = XLSX.utils.sheet_to_json(worksheet1);
            res.status(200).json(xltojsondata);

        } catch (err) {
            return console.log(err.message);
        }
    });
});

module.exports = router;