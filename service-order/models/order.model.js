const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id_restorant : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restorant'
      },
    // id_customer : mongoose.Schema.Types.ObjectId,
    // id_delivery_person : mongoose.Schema.Types.ObjectId,
    order_state : String,
    // id_address : mongoose.Schema.Types.ObjectId,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }],
    customer : {
        id_customer : Number,
        firstname : String,
        lastname : String,
        gender : String,
        birthday : Date,
        phone : String,
        email : String,
    },
    address : {
        id_address : Number,
        street : String,
        postal_code : String,
        city : String,
        street_number : String,
        lati : Number,
        longi : Number,
    },
    delivery_person : {
        id_delivery_person: Number,
        firstname : String,
        lastname : String,
    },
    order_date : { type: Date, default: Date.now },
    order_delivery_date : { type: Date, default: null },
    invoice_number : String,
    discount : Number,
    date_in: { type: Date, default: Date.now },
    date_out: { type: Date, default: null },
});

module.exports = mongoose.model("Order", schema);