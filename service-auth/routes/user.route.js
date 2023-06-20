const express = require('express');
var app = express();
const router = express.Router();
const User = require('../controllers/user.controller.js');
const checkToken = require('../tokenChecker.js');


router.get('/getUsers', checkToken(["is_technical_department", "is_administrator", "is_sales_department"], true), User.findAll);
router.get('/getUser/:id', User.findOne);
router.post('/createUser', User.create);
router.put('/updateUser/:id', User.update);
router.delete('/deleteUser/:id', User.delete);
router.get('/getRoleUser/:id', User.findRoleUser);
router.get('/getRolesUsers', User.findAllRolesUsers);
router.get('/getUserAddress/:id', User.findUserAddress);
router.get('/getUsersAddresses', User.findAllUsersAddresses);

module.exports = router;