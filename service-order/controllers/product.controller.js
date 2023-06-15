//like post controller but for Product
const mongoose = require("mongoose");
const Product = require("../models/product.model.js");
const { ObjectId } = mongoose.Types;

// Tous les produits avec date_in et date_out
const getAllProducts = async (req, res) => {
  try {
    const product = await Product.find({ date_out: null });
    const count = await Product.countDocuments({ date_out: null });
    res.status(200).json({ result: { product, count }, status: "success" });
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
    });
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
    id_restorant: req.body.id_restorant,
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_category: req.body.product_category,
  });
  try {
    const newProduct = await ProductObj.save();
    res.status(200).json({ result: newProduct, status: "success" });
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
    (product.id_restorant = req.body.id_restorant),
      (product.product_name = req.body.product_name),
      (product.product_price = req.body.product_price),
      (product.product_category = req.body.product_category),
      await product.save();
    res.status(200).json({ result: product, status: "success" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Le produit n'a pas pu être mis à jour !",
        status: "error",
        error: error.message,
      });
  }
};

//delete Product (just change date_out)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.date_out = Date.now();
    await product.save();
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
      "id_restorant"
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
    }).populate("id_restorant");
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

module.exports = {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsWithRestorant,
  getOneProductWithRestorant,
};
