const express = require('express');
const port = 3000;
const { getAllOrders, getOneOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/order.controller.js');
const router = express.Router();

router.get('/getAllOrders', async (req, res) => getAllOrders(req, res));
router.get('/getOneOrder/:id', async (req, res) => getOneOrder(req, res));
router.post('/createOrder', async (req, res) => createOrder(req, res));
router.put('/updateOrder/:id', async (req, res) => updateOrder(req, res));
router.delete('/deleteOrder/:id', async (req, res) => deleteOrder(req, res));

module.exports = router;