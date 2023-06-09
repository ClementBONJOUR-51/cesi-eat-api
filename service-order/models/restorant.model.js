const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    restorant_name : String,
    restorant_type : String,
    phone_number : String,
    date_in: { type: Date, default: Date.now },
    date_out: { type: Date, default: null },

});

module.exports = mongoose.model("Restorant", schema);