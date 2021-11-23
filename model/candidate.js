const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    number: {
        type: String
    },
    dob: {
        type: Number
    },
    work_exp: {
        type: String
    },
    resume_title: {
        type: String
    },
    current_loc: {
        type: String
    },
    postal_addr: {
        type: String
    },
    current_employer: {
        type: String
    },
    current_desgn: {
        type: String
    }
});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;