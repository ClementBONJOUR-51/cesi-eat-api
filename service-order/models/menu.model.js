const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    menu_name : String,
    restorant : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restorant'
      },
    menu_starters : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    menu_dishes :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    menu_desserts :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    menu_beverages :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    date_in: { type: Date, default: Date.now },
    date_out: { type: Date, default: null },
});

module.exports = mongoose.model("Menu", schema);

