const express = require("express");
const port = 3000;
const { getAllMenus, getOneMenu, createMenu, updateMenu, deleteMenu, getAllMenusByRestorant } = require("../controllers/menu.controller.js");
const router = express.Router();

router.get("/getAllMenus", async (req, res) => getAllMenus(req, res));
router.get("/getOneMenu/:id", async (req, res) => getOneMenu(req, res));
router.post("/createMenu", async (req, res) => createMenu(req, res));
router.put("/updateMenu/:id", async (req, res) => updateMenu(req, res));
router.delete("/deleteMenu/:id", async (req, res) => deleteMenu(req, res));
router.get("/getAllMenusByRestorant/:id", async (req, res) => getAllMenusByRestorant(req, res));

module.exports = router;

