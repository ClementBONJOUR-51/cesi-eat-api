//like post controller but for Order
const mongoose = require("mongoose");
const Order = require("../models/order.model.js");
const { ObjectId } = mongoose.Types;

// Toutes les commandes avec date_in et date_out
const getAllOrders = async (req, res) => {
    try {
        const order = await Order.find({ date_out: null });
        const count = await Order.countDocuments({ date_out: null });
        res.status(200).json({ order, count });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//get one Order
const getOneOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            date_out: null
        });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//create Order
const createOrder = async (req, res) => {
    const OrderObj = new Order({
        id_restorant : req.body.id_restorant,
        id_customer : req.body.id_customer,
        id_delivery_person : req.body.id_delivery_person,
        order_state : req.body.order_state,
        id_address : req.body.id_address,
        invoice_number : req.body.invoice_number,
        discount : req.body.discount,
    });
    try {
        const newOrder = await OrderObj.save();
        res.status(201).json(newOrder);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//update Order
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        order.id_restorant = req.body.id_restorant,
        order.id_customer = req.body.id_customer,
        order.id_delivery_person = req.body.id_delivery_person,
        order.order_state = req.body.order_state,
        order.id_address = req.body.id_address,
        order.invoice_number = req.body.invoice_number,
        order.discount = req.body.discount,
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//delete Order (just change date_out)
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        order.date_out = Date.now();
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { getAllOrders, getOneOrder, createOrder, updateOrder, deleteOrder };