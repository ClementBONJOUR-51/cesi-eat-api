//like post controller but for Product
const mongoose = require("mongoose");
const Product = require("../models/product.model.js");
const Restorant = require("../models/restorant.model.js");
const Notification = require("../models/notification.model.js");
const { ObjectId } = mongoose.Types;

// Tous les produits avec date_in et date_out + populate sur restorant
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ date_out: null }).populate(
      "restorant"
    );
    const count = await Product.countDocuments({ date_out: null });
    res.status(200).json({ result: { products, count }, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Les produits sont introuvables !",
        status: "error",
        error: error.message,
      });
  }
};


//get one Product avec date_in et date_out
const getOneProduct = async (req, res) => {
  try {
    //trouver par l'id et date_out = null
    const product = await Product.findOne({
      _id: req.params.id,
      date_out: null,
    }).populate(
      "restorant"
    );
    res.status(200).json({ result: product, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Le produit est introuvable !",
        status: "error",
        error: error.message,
      });
  }
};

//create Product
const createProduct = async (req, res) => {
  const ProductObj = new Product({
    restorant: req.body.restorant,
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_category: req.body.product_category,
  });
  try {
    const restorant = await Restorant.findById(ProductObj.restorant);
    const newProduct = await ProductObj.save();
    const notificationMessage = {
      Titre: "Nouveau produit",
      message: "Vous avez ajouté un nouveau produit " + req.body.product_name,
    };
  
    const newNotification = new Notification({
      id_user: restorant.restorer.id_user,
      type: "order",
      message: JSON.stringify(notificationMessage),
      read: false,
    });
  
    // Enregistrez la nouvelle notification
    const savedNotification = await newNotification.save();
  
    res.status(200).json({ result: newProduct, notification: savedNotification, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Le produit n'a pas pu être ajouté !",
        status: "error",
        error: error.message,
      });
  }
};

//update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    // if(product.restorant == req.decoded.id || authorized.includes(req.decoded.role)){
      product.restorant = req.body.restorant;
      product.product_name = req.body.product_name;
      product.product_price = req.body.product_price;
      product.product_category = req.body.product_category;
      await product.save();
      const notificationMessage = {
        Titre: "Modification du produit",
        message: "Vous avez modifié un produit " + req.body.product_name,
      };
    
      const restorant = await Restorant.findById(product.restorant);
      const newNotification = new Notification({
        id_user: restorant.restorer.id_user,
        type: "order",
        message: JSON.stringify(notificationMessage),
        read: false,
      });
    
      // Enregistrez la nouvelle notification
      const savedNotification = await newNotification.save();
    
      res.status(200).json({ result: product, notification: savedNotification, status: "success" });
    res.status(200).json({ result: product, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Le produit n'a pas pu être modifié !",
        status: "error",
        error: error.message,
      });
  }
};


//delete Product (just change date_out)
const deleteProduct = async (req, res) => {
  // const authorized = ["is_administrator"];
  try {
    const product = await Product.findById(req.params.id);
    // if(product.restorant == req.decoded.id || authorized.includes(req.decoded.role)){
      product.date_out = Date.now();
      await product.save();
    // }else{
    //   res.status(500).json({ message: "Vous n'avez pas l'autorisation de supprimer ce produit !", status: "error" });
    // }
    res.status(200).json({ result: product, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Le produit est introuvable !",
        status: "error",
        error: error.message,
      });
  }
};

// getProductsWithRestorant
const getProductsWithRestorant = async (req, res) => {
  try {
    const products = await Product.find({ date_out: null }).populate(
      "restorant"
    );
    const count = await Product.countDocuments({ date_out: null });
    res.status(200).json({ result: { products, count }, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Les produits sont introuvables !",
        status: "error",
        error: error.message,
      });
  }
};

const getOneProductWithRestorant = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      date_out: null,
    }).populate("restorant");
    res.status(200).json({ result: product, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Le produit est introuvable !",
        status: "error",
        error: error.message,
      });
  }
};

// Obtenir tous les produits d'un restaurant
const getAllProductsFromRestorant = async (req, res) => {
  try {
    const products = await Product.find({
      restorant: req.params.id,
      date_out: null,
    }).populate("restorant");
    const count = await Product.countDocuments({
      restorant: req.params.id,
      date_out: null,
    });
    res.status(200).json({ result: { products, count }, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Les produits sont introuvables !",
        status: "error",
        error: error.message,
      });
  }
};

module.exports = {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsWithRestorant,
  getOneProductWithRestorant,
  getAllProductsFromRestorant,
};
