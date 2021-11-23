require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

morgan.token('id', function getId(req) {
    return req.id
});
// app.use(morgan('dev')); // https://github.com/expressjs/morgan#dev
app.use(assignId);
app.use(morgan(':id :method :url :status :res[content-length] - :response-time ms'));

function assignId(req, res, next) {
    req.id = '----------'
    next();
}


// to easily get form POST data
app.use(express.json());
// to serve static content
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use('/', require('./routes/home'));
app.use('/upload', require('./routes/upload'));
app.use('/api/upload', require('./api/upload'));

module.exports = app;