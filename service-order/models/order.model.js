const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id_restorant : mongoose.Schema.Types.ObjectId,
    id_customer : mongoose.Schema.Types.ObjectId,
    id_delivery_person : mongoose.Schema.Types.ObjectId,
    order_state : String,
    id_address : mongoose.Schema.Types.ObjectId,
    order_date : { type: Date, default: Date.now },
    order_delivery_date : { type: Date, default: null },
    invoice_number : String,
    discount : Number,
    date_in: { type: Date, default: Date.now },
    date_out: { type: Date, default: null },

});

module.exports = mongoose.model("Order", schema);