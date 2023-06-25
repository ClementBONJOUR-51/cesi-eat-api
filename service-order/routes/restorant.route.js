const express = require('express');
const port = 3000;
const { getAllRestorants, getOneRestorant, createRestorant, updateRestorant, deleteRestorant, getRestorantByRestorerId, } = require('../controllers/restorant.controller.js');
const router = express.Router();

router.get('/getAllRestorants', async (req, res) => getAllRestorants(req, res));
router.get('/getOneRestorant/:id', async (req, res) => getOneRestorant(req, res));
router.post('/createRestorant', async (req, res) => createRestorant(req, res));
router.put('/updateRestorant/:id', async (req, res) => updateRestorant(req, res));
router.delete('/deleteRestorant/:id', async (req, res) => deleteRestorant(req, res));
router.get('/getRestorantByRestorerId/:id', async (req, res) => getRestorantByRestorerId(req, res));


module.exports = router;