const express = require('express');
const port = 3000;
const { getAllProducts, getOneProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller.js');
const router = express.Router();

router.get('/getAllProducts', async (req, res) => getAllProducts(req, res));
router.get('/getOneProduct/:id', async (req, res) => getOneProduct(req, res));
router.post('/createProduct', async (req, res) => createProduct(req, res));
router.put('/updateProduct/:id', async (req, res) => updateProduct(req, res));
router.delete('/deleteProduct/:id', async (req, res) => deleteProduct(req, res));

module.exports = router;