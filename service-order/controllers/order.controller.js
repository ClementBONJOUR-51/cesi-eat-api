//like post controller but for Order
const mongoose = require("mongoose");
const Order = require("../models/order.model.js");
const { ObjectId } = mongoose.Types;

// Toutes les commandes avec date_in et date_out
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ date_out: null })
      .populate("restorant")
      .populate("products");
    const count = await Order.countDocuments({ date_out: null });
    res.status(200).json({ result: { orders, count }, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Les commandes n'ont pas été trouvées",
      status: "error",
      error: error.message,
    });
  }
};

//get one Order
const getOneOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      date_out: null,
    })
      .populate("restorant")
      .populate("products");
    res.status(200).json({ result: order, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "La commande n'a pas été trouvée",
      status: "error",
      error: error.message,
    });
  }
};

//create Order
const createOrder = async (req, res) => {
  // générer un numéro de facture de 5 caractères avec chiffres et lettres et en majuscule
  const invoice_number = Math.random().toString(36).substr(2, 5).toUpperCase();
  const deliveryPerson = req.body.delivery_person
    ? {
        id_delivery_person: req.body.delivery_person.id_delivery_person,
        firstname: req.body.delivery_person.firstname,
        lastname: req.body.delivery_person.lastname,
        phone_delivery: req.body.delivery_person.phone_delivery,
        email: req.body.delivery_person.email,
      }
    : null;
  console.log(invoice_number);
  // récupérer les id des produits
  const productIds = req.body.products.map((product) => product.id_product);
  const OrderObj = new Order({
    restorant: req.body.restorant,
    // id_customer : req.body.id_customer,
    // id_delivery_person : req.body.id_delivery_person,
    order_state: req.body.order_state,
    paid: req.body.paid,
    // id_address : req.body.id_address,
    products: productIds,
    customer: {
      id_customer: req.body.customer.id_customer,
      firstname: req.body.customer.firstname,
      lastname: req.body.customer.lastname,
      gender: req.body.customer.gender,
      birthday: req.body.customer.birthday,
      phone: req.body.customer.phone,
      email: req.body.customer.email,
    },
    address: {
      street: req.body.address.street,
      postal_code: req.body.address.postal_code,
      city: req.body.address.city,
      street_number: req.body.address.street_number,
      lati: req.body.address.lati,
      longi: req.body.address.longi,
    },
    delivery_person: deliveryPerson,
    invoice_number: invoice_number,
    discount: req.body.discount,
  });
  try {
    const newOrder = await OrderObj.save();
    res.status(200).json({ result: newOrder, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "La commande n'a pas pu être créée",
      status: "error",
      error: error.message,
    });
  }
};

//update Order
const updateOrder = async (req, res) => {
  try {
    const productIds = req.body.products.map((product) => product.id_product);
    const order = await Order.findById(req.params.id);
    // Si je n'ai pas de delivery_person mais qu'il existe déjà dans la BDD je le laisse sinon s'il n'existe pas je met null
    let deliveryPerson = null; // Initialiser avec null par défaut

    if (req.body.delivery_person) {
      // Si req.body contient un delivery_person
      deliveryPerson = {
        id_delivery_person: req.body.delivery_person.id_delivery_person,
        firstname: req.body.delivery_person.firstname,
        lastname: req.body.delivery_person.lastname,
        phone_delivery: req.body.delivery_person.phone_delivery,
        email: req.body.delivery_person.email,
      };
    } else if (order.delivery_person) {
      // Si delivery_person existe déjà dans la base de données
      deliveryPerson = order.delivery_person; // Conserver la valeur existante
    }
    (order.restorant = req.body.restorant),
      // order.id_customer = req.body.id_customer,
      // order.id_delivery_person = req.body.id_delivery_person,
      (order.order_state = req.body.order_state),
      (order.paid = req.body.paid),
      // order.id_address = req.body.id_address,
      (order.products = productIds),
      (order.customer = {
        id_cutosmer: req.body.customer.id_customer,
        firstname: req.body.customer.firstname,
        lastname: req.body.customer.lastname,
        gender: req.body.customer.gender,
        birthday: req.body.customer.birthday,
        phone: req.body.customer.phone,
        email: req.body.customer.email,
      }),
      (order.address = {
        street: req.body.address.street,
        postal_code: req.body.address.postal_code,
        city: req.body.address.city,
        street_number: req.body.address.street_number,
        lati: req.body.address.lati,
        longi: req.body.address.longi,
      }),
      (order.delivery_person = deliveryPerson),
      (order.invoice_number = req.body.invoice_number),
      (order.discount = req.body.discount),
      await order.save();
    res.status(200).json({ result: order, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "La commande est introuvable !",
      status: "error",
      error: error.message,
    });
  }
};

//delete Order (just change date_out)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.date_out = Date.now();
    await order.save();
    res.status(200).json({ result: order, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "La commande est introuvable !",
      status: "error",
      error: error.message,
    });
  }
};

const getOrdersWithProducts = async (req, res) => {
  //populate products pour une commande
  try {
    const orders = await Order.find({ date_out: null }).populate("products"); // polutate sert a recuperer les infos de l'objet
    const count = await Order.countDocuments({ date_out: null });
    res.status(200).json({ result: { orders, count }, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Les commandes et les produits sont introuvables !",
      status: "error",
      error: error.message,
    });
  }
};

// getOneOrderWithProducts
const getOneOrderWithProducts = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      date_out: null,
    }).populate("products");
    res.status(200).json({ result: order, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "La commande et les produits sont introuvables !",
      status: "error",
      error: error.message,
    });
  }
};

// getOrdersWithRestorant
const getOrdersWithRestorants = async (req, res) => {
  try {
    const orders = await Order.find({ date_out: null }).populate("restorant");
    const count = await Order.countDocuments({ date_out: null });
    res.status(200).json({ result: { orders, count }, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "La commande est introuvable !",
      status: "error",
      error: error.message,
    });
  }
};

// getOneOrderWithRestorant
const getOneOrderWithRestorant = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      date_out: null,
    }).populate("restorant");
    res.status(200).json({ result: order, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "La commande est introuvable !",
      status: "error",
      error: error.message,
    });
  }
};

// Assigner un livreur à une commande vérifier si delivery_person existe déjà dans la base de données
// const assignDeliveryPersonToOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     order.delivery_person = {
//       id_delivery_person: req.body.delivery_person.id_delivery_person,
//       firstname: req.body.delivery_person.firstname,
//       lastname: req.body.delivery_person.lastname,
//       phone_delivery: req.body.delivery_person.phone_delivery,
//       email: req.body.delivery_person.email,
//     };
//     await order.save();
//     res.status(200).json({ result: order, status: "success" });
//   } catch (error) {
//     res.status(500).json({
//       message: "La commande est introuvable !",
//       status: "error",
//       error: error.message,
//     });
//   }
// };
// Assigner un livreur à une commande vérifier si delivery_person existe déjà dans la base de données
const assignDeliveryPersonToOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    // console.log(typeof(order.delivery_person));
    if (!order.delivery_person.id_delivery_person) {
      order.order_state = "En cours de livraison";
      
    // console.log('ajout', order.delivery_person.id_delivery_person);
      order.delivery_person = {
        id_delivery_person: req.body.delivery_person.id_delivery_person,
        firstname: req.body.delivery_person.firstname,
        lastname: req.body.delivery_person.lastname,
        phone_delivery: req.body.delivery_person.phone_delivery,
        email: req.body.delivery_person.email,
      };
      await order.save();
      res.status(200).json({ result: order, status: "success" });
    } else {
      res.status(200).json({
        message: "La commande a déjà un livreur !",
        status: "error",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "La commande est introuvable !",
      status: "error",
      error: error.message,
    });
  }
};



// Historique des commandes d'un client avec l'état order_state = "livrée" date_out = null
const getOrdersWithProductsAndRestorantsByCustomerId = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.params.id,
      order_state: "livrée",
      date_out: null,
    })
      .populate("products")
      .populate("restorant");
    const count = await Order.countDocuments({
      customer: req.params.id,
      order_state: "livrée",
      date_out: null,
    });
    res.status(200).json({ result: { orders, count }, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Les commandes sont introuvables !",
      status: "error",
      error: error.message,
    });
  }
};



// Lister les order n'ayant pas d'id delivery_person en affichant toutes les informations du resto
// const getOrdersWithoutDeliveryPerson = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       date_out: null,
//       delivery_person: { $exists: false },
//     });
//     const count = await Order.countDocuments({
//       date_out: null,
//       delivery_person: { $exists: false },
//     });
//     res.status(200).json({ result: { orders, count }, status: "success" });
//   } catch (error) {
//     res.status(500).json({
//       message: "Les commandes sont introuvables !",
//       status: "error",
//       error: error.message,
//     });
//   }
// };
// Lister les order n'ayant pas d'id delivery_person en affichant toutes les informations du resto par populate
const getOrdersWithoutDeliveryPerson = async (req, res) => {
  try {
    const orders = await Order.find({
      date_out: null,
      delivery_person: { $exists: false },
    }).populate("restorant");
    const count = await Order.countDocuments({
      date_out: null,
      delivery_person: { $exists: false },
    });
    res.status(200).json({ result: { orders, count }, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Les commandes sont introuvables !",
      status: "error",
      error: error.message,
    });
  }
};



// Avoir toutes les commandes d'un restorant + populate restorant
const getOrdersByRestorantId = async (req, res) => {
  try {
    const orders = await Order.find({
      "restorant": req.params.id,
      date_out: null,
    }).populate("restorant");
    const count = await Order.countDocuments({
      "restorant": req.params.id,
      date_out: null,
    });
    res.status(200).json({ result: { orders, count }, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "Les commandes sont introuvables !",
      status: "error",
      error: error.message,
    });
  }
};

// Afficher la commande d'un client avec les produits et le restorant associé à la commande avec date_out null
const getOneOrderByCustomerId = async (req, res) => {
  try {
    const order = await Order.findOne({
      date_out: null,
      "customer.id_customer": req.params.id,
    })
      .populate("products")
      .populate("restorant");
    res.status(200).json({ result: order, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "La commande est introuvable !",
      status: "error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOneOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersWithProducts,
  getOneOrderWithProducts,
  getOrdersWithRestorants,
  getOneOrderWithRestorant,
  assignDeliveryPersonToOrder,
  getOrdersWithProductsAndRestorantsByCustomerId,
  getOrdersWithoutDeliveryPerson,
  getOrdersByRestorantId,
  getOneOrderByCustomerId,
};
