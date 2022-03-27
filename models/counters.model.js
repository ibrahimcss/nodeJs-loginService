const mongoose = require("mongoose");

const Counters = mongoose.model(
    "Counters",
    new mongoose.Schema({
        _id: {type: String, required: true},
        sequence_value: { type: Number, default: 0 }
    })
);

module.exports = Counters;
