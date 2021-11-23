const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

console.log(`{MONGO_URI}: ${MONGO_URI}`);

exports.connect = () => {
    mongoose
        .connect(MONGO_URI)
        .then(
            () => {
                console.log(`MONGODB ready to use...`);
            }
        )
        .catch((err) => {
            console.log(`MONGODB connection falied`);
            console.log(err.message);
        });
};