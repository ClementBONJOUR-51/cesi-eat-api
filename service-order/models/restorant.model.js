const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    restorant_name : String,
    restorant_type : String,
    phone_number : String,
    restorer : 
    {
        id_user : Number,
        firstname : String,
        lastname : String,
        gender : String,
        birthday : Date,
        phone : String,
        email : String,
    },
    address:{
        street : String,
        postal_code : String,
        city : String,
        street_number : String,
        lati : Number,
        longi : Number,
    },
    date_in: { type: Date, default: Date.now },
    date_out: { type: Date, default: null },

});

module.exports = mongoose.model("Restorant", schema);