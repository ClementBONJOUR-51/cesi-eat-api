const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    restorant : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restorant'
      },
    product_name : String,
    product_price : Number,
    product_category : String,
    date_in: { type: Date, default: Date.now },
    date_out: { type: Date, default: null },

});

module.exports = mongoose.model("Product", schema);