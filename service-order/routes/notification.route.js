const express = require('express');
const port = 3000;
const { createNotification, getAllNotificationByUserId, updateNotification } = require('../controllers/notification.controller.js');
const router = express.Router();

router.post('/createNotification', async (req, res) => createNotification(req, res));
router.get('/getAllNotificationByUserId/:id', async (req, res) => getAllNotificationByUserId(req, res));
router.put('/updateNotification/:id', async (req, res) => updateNotification(req, res));

module.exports = router;