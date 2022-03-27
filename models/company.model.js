const mongoose = require("mongoose");

const Company = mongoose.model(
    "Company",
    new mongoose.Schema({
        _id:Number,
        name: String
    })
);

module.exports = Company;
