const express = require('express');
const router = express.Router();
const multer = require('multer');
// https://github.com/SheetJS/sheetjs#parsing-workbooks
const XLSX = require('xlsx');
const Candidate = require('../model/candidate');
const async = require('async');

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
            const xlfilename = req.file.filename;
            const st_arr = xlfilename.split('.');
            const ext = st_arr[st_arr.length - 1];
            console.log(ext);
            if (!(ext === 'xlsx' || ext === 'xls')) {
                return res.status(400).render('upload', { message: 'OOPs invalid file format' });
            }
            const workbook = XLSX.readFile(xlfilepath); // https://github.com/SheetJS/sheetjs#working-with-the-workbook
            // console.log(workbook);
            // return res.status(200).json(workbook);
            // https://github.com/SheetJS/sheetjs#parsing-options
            console.log(workbook.SheetNames); // https://github.com/SheetJS/sheetjs#working-with-the-workbook
            const firstSheetName = workbook.SheetNames[0];
            console.log(firstSheetName);
            const worksheet1 = workbook.Sheets[firstSheetName];
            // console.log(XLSX.utils.sheet_to_json(worksheet1));
            const xltojsondata = XLSX.utils.sheet_to_json(worksheet1, { raw: false }); // https://github.com/SheetJS/sheetjs#json
            // return res.status(200).json(xltojsondata);
            const xldataobj = JSON.parse(JSON.stringify(xltojsondata));
            const attr = ['Name of the Candidate', 'Email', 'Mobile No.', 'Date of Birth', 'Work Experience', 'Resume Title', 'Current Location', 'Postal Address', 'Current Employer', 'Current Designation'];
            console.log(attr);


            // https://caolan.github.io/async/v3/docs.html#each
            // https://caolan.github.io/async/v3/docs.html#eachSeries
            async.eachSeries(xldataobj, async function(e, cb) {
                    // console.log(e);
                    const old_c = await Candidate.findOne({ email: e[attr[1]] });
                    if (old_c) {
                        console.log(`duplicate record ${old_c.email} already registered!!!`);
                    } else {
                        if (!(e[attr[0]] && e[attr[1]])) {
                            console.log(`Name & Email both are required!!!`);
                        } else {
                            const c = new Candidate({
                                name: e[attr[0]],
                                email: e[attr[1]],
                                number: e[attr[2]],
                                dob: e[attr[3]],
                                work_exp: e[attr[4]],
                                resume_title: e[attr[5]],
                                current_loc: e[attr[6]],
                                postal_addr: e[attr[7]],
                                current_employer: e[attr[8]],
                                current_desgn: e[attr[9]]
                            });
                            await c.save();
                            console.log(`succesfully saved record ${c.email}!!!`);
                        }
                    }
                    return cb();
                },
                function(err) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log('all done!!!');
                        return res.status(200).render('info', { message: 'Your records will be processed shortly.', imgUrl: '/pix/success.png' });
                    }

                });
        } catch (err) {
            return console.log(err.message);
        }
    });
});

module.exports = router;