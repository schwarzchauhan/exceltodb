const express = require('express');
const router = express.Router();

router.route('/')

.get((req, res) => {
    res.render('upload', { message: 'Upload a .xlsx or .xls file here' });
});

module.exports = router;