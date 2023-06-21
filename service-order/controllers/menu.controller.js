const mongoose = require("mongoose");
const Menu = require("../models/menu.model.js");
const { ObjectId } = mongoose.Types;

// Tous les menus avec date_in et date_out + populate sur restorant + produits
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find({ date_out: null })
      .populate("restorant")
      .populate("menu_starters")
      .populate("menu_dishes")
      .populate("menu_desserts")
      .populate("menu_beverages");
    const count = await Menu.countDocuments({ date_out: null });
    res.status(200).json({ result: { menus, count }, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Les menus sont introuvables !",
      status: "error",
      error: error.message,
    });
  }
};

//get one menu avec date_in et date_out + populate sur restorant + produits
const getOneMenu = async (req, res) => {
  try {
    //trouver par l'id et date_out = null
    const menu = await Menu.findOne({ _id: req.params.id, date_out: null })
      .populate("restorant")
      .populate("menu_starters")
      .populate("menu_dishes")
      .populate("menu_desserts")
      .populate("menu_beverages");
    res.status(200).json({ result: menu, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Le menu est introuvable !",
      status: "error",
      error: error.message,
    });
  }
};

//create menu mais avec choix de plusieurs produits
const createMenu = async (req, res) => {
  //.map pour recuperer les id des produits dans starters, dishes, desserts et beverages
  const starters = req.body.menu_starters.map((starter) => starter.id_product);
  const dishes = req.body.menu_dishes.map((dish) => dish.id_product);
  const desserts = req.body.menu_desserts.map((dessert) => dessert.id_product);
  const beverages = req.body.menu_beverages.map((beverage) => beverage.id_product);

  const MenuObj = new Menu({
    restorant: req.body.restorant,
    menu_name: req.body.menu_name,
    menu_starters: starters,
    menu_dishes: dishes,
    menu_desserts: desserts,
    menu_beverages: beverages,
  });
  try {
    const newMenu = await MenuObj.save();
    res.status(200).json({ result: newMenu, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Le menu n'a pas pu être créé !",
      status: "error",
      error: error.message,
    });
  }
};

// update menu avec choix de plusieurs produits
const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({ _id: req.params.id, date_out: null });
    const starters = req.body.menu_starters.map((starter) => starter.id_product);
    const dishes = req.body.menu_dishes.map((dish) => dish.id_product);
    const desserts = req.body.menu_desserts.map((dessert) => dessert.id_product);
    const beverages = req.body.menu_beverages.map((beverage) => beverage.id_product);
    if (menu) {
      menu.restorant = req.body.restorant;
      menu.menu_name = req.body.menu_name;
      menu.menu_starters = starters;
      menu.menu_dishes = dishes;
      menu.menu_desserts = desserts;
      menu.menu_beverages = beverages;
      const newMenu = await menu.save();
      res.status(200).json({ result: newMenu, status: "success" });
    } else {
      res
        .status(404)
        .json({ message: "Le menu est introuvable !", status: "error" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Le menu n'a pas pu être modifié !",
      status: "error",
      error: error.message,
    });
  }
};

// delete menu avec date_out = date du jour
const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({ _id: req.params.id, date_out: null });
    if (menu) {
      menu.date_out = Date.now();
      const newMenu = await menu.save();
      res.status(200).json({ result: newMenu, status: "success" });
    } else {
      res
        .status(404)
        .json({ message: "Le menu est introuvable !", status: "error" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Le menu n'a pas pu être supprimé !",
      status: "error",
      error: error.message,
    });
  }
};

// Tous les menus d'un restorant avec populate
const getAllMenusByRestorant = async (req, res) => {
  try {
    const menus = await Menu.find({ restorant: req.params.id, date_out: null })
      .populate("restorant")
      .populate("menu_starters")
      .populate("menu_dishes")
      .populate("menu_desserts")
      .populate("menu_beverages");
    const count = await Menu.countDocuments({
      restorant: req.params.id,
      date_out: null,
    });
    res.status(200).json({ result: { menus, count }, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Les menus sont introuvables !",
      status: "error",
      error: error.message,
    });
  }
};






module.exports = {
  getAllMenus,
  getOneMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  getAllMenusByRestorant,
};
