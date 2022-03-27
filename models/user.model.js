const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        _id:Number,
        username: String,
        email: String,
        password: String,
        createDate: Date,
        companyId:Number,
        roles: [
            {
                type: Number,
                ref: "Role"
            }
        ]
    })
);

module.exports = User;
