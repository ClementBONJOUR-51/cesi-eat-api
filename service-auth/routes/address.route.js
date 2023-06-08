const express = require('express');
var app = express();
const router = express.Router();
const Address = require('../controllers/address.controller.js');

router.get('/getAddresses', Address.findAll);
router.get('/getAddress/:id', Address.findOne);
router.post('/createAddress', Address.create);
router.put('/updateAddress/:id', Address.update);
router.delete('/deleteAddress/:id', Address.delete);

module.exports = router;