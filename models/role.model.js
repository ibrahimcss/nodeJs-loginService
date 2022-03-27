const mongoose = require("mongoose");

const Role = mongoose.model(
    "Role",
    new mongoose.Schema({
        _id:Number,
        name: String
    })
);

module.exports = Role;
