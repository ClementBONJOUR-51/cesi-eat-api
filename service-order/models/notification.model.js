const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id_user: Number,
    type: String,
    message: String,
    read: Boolean,
});

module.exports = mongoose.model("Notification", schema);