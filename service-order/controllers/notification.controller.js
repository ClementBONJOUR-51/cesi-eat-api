const mongoose = require("mongoose");
const Notification = require("../models/notification.model.js");
const { ObjectId } = mongoose.Types;

// Créer une notification avec le read à false 
const createNotification = async (req, res) => {
    const NotificationObj = new Notification({
        id_user: req.body.id_user,
        type: req.body.type,
        message: req.body.message,
        read: false,
    });
    try {
        const notification = await NotificationObj.save();
        res.status(201).json({ result: notification, status: "success" });
    } catch (error) {
        res.status(500).json({
            message: "La notification n'a pas pu être créée !",
            status: "error",
            error: error.message,
        });
    }
};

// Lire des notifications avec l'id du user
const getAllNotificationByUserId = async (req, res) => {
    try {
        const notifications = await Notification.find({ 
            id_user: req.params.id 
        });
        const count = await Notification.countDocuments({ 
            id_user: req.params.id 
        });
        res.status(200).json({ result: { notifications, count }, status: "success" });
    } catch (error) {
        res.status(500).json({
            message: "Les notifications n'ont pas pu être récupérées !",
            status: "error",
            error: error.message,
        });
    }
}

// Mise à jour du read des notifications en 1
const updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({ 
            _id: req.params.id 
        });
        if (notification) {
            notification.read = true;
            const newNotification = await notification.save();
            res.status(200).json({ result: newNotification, status: "success" });
        } else {
            res
                .status(404)
                .json({ message: "La notification est introuvable !", status: "error" });
        }
    } catch (error) {
        res.status(500).json({
            message: "La notification n'a pas pu être modifiée !",
            status: "error",
            error: error.message,
        });
    }
};


module.exports = {
    createNotification,
    getAllNotificationByUserId,
    updateNotification,
};
