const express = require('express');
const port = 3000;
const { getAllProducts, getOneProduct, createProduct, updateProduct, deleteProduct, getProductsWithRestorant, getOneProductWithRestorant, getAllProductsFromRestorant } = require('../controllers/product.controller.js');
const router = express.Router();
const checkToken = require('../tokenChecker.js');

router.get('/getAllProducts', async (req, res) => getAllProducts(req, res));
router.get('/getOneProduct/:id', async (req, res) => getOneProduct(req, res));
router.post('/createProduct', async (req, res) => createProduct(req, res));
router.put('/updateProduct/:id', async (req, res) => updateProduct(req, res)); 
router.delete('/deleteProduct/:id', async (req, res) => deleteProduct(req, res));
router.get('/getProductsWithRestorant', async (req, res) => getProductsWithRestorant(req, res));
router.get('/getOneProductWithRestorant/:id', async (req, res) => getOneProductWithRestorant(req, res));
router.get('/getAllProductsFromRestorant/:id', async (req, res) => getAllProductsFromRestorant(req, res));

// route avec un checkToken [is_administrator] mais en même temps ne pas être [is_administrator] pour pouvoir accéder à la route



module.exports = router;