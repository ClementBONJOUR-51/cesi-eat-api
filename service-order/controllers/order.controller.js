//like post controller but for Order
const mongoose = require("mongoose");
const Order = require("../models/order.model.js");
const Notification = require("../models/notification.model.js");
const Restorant = require("../models/restorant.model.js");
const moment = require("moment");
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

//create Order avec order_state = "CREATED"
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
    order_state: "CREATED",
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
    const notificationMessage = {
      Titre: "Nouvelle commande",
      message: "Une nouvelle commande a été créée avec le numéro de facture " + invoice_number,
    };
  
    const newNotification = new Notification({
      id_user: req.body.customer.id_customer,
      type: "order",
      message: JSON.stringify(notificationMessage),
      read: false,
    });
  
    // Enregistrez la nouvelle notification
    const savedNotification = await newNotification.save();
  
    res.status(200).json({ result: newOrder, notification: savedNotification, status: "success" });
  } catch (error) {
    res.status(500).json({
      message: "La commande n'a pas pu être créée",
      status: "error",
      error: error.message,
    });
  }
};

//update Order
// const updateOrder = async (req, res) => {
//   try {
//     const productIds = req.body.products.map((product) => product.id_product);
//     const order = await Order.findById(req.params.id);
//     // Si je n'ai pas de delivery_person mais qu'il existe déjà dans la BDD je le laisse sinon s'il n'existe pas je met null
//     let deliveryPerson = null; // Initialiser avec null par défaut

//     if (req.body.delivery_person) {
//       // Si req.body contient un delivery_person
//       deliveryPerson = {
//         id_delivery_person: req.body.delivery_person.id_delivery_person,
//         firstname: req.body.delivery_person.firstname,
//         lastname: req.body.delivery_person.lastname,
//         phone_delivery: req.body.delivery_person.phone_delivery,
//         email: req.body.delivery_person.email,
//       };
//     } else if (order.delivery_person) {
//       // Si delivery_person existe déjà dans la base de données
//       deliveryPerson = order.delivery_person; // Conserver la valeur existante
//     }
//     (order.restorant = req.body.restorant),
//       // order.id_customer = req.body.id_customer,
//       // order.id_delivery_person = req.body.id_delivery_person,
//       (order.order_state = req.body.order_state),
//       (order.paid = req.body.paid),
//       // order.id_address = req.body.id_address,
//       (order.products = productIds),
//       (order.customer = {
//         id_customer: req.body.customer.id_customer,
//         firstname: req.body.customer.firstname,
//         lastname: req.body.customer.lastname,
//         gender: req.body.customer.gender,
//         birthday: req.body.customer.birthday,
//         phone: req.body.customer.phone,
//         email: req.body.customer.email,
//       }),
//       (order.address = {
//         street: req.body.address.street,
//         postal_code: req.body.address.postal_code,
//         city: req.body.address.city,
//         street_number: req.body.address.street_number,
//         lati: req.body.address.lati,
//         longi: req.body.address.longi,
//       }),
//       (order.delivery_person = deliveryPerson),
//       (order.invoice_number = req.body.invoice_number),
//       (order.discount = req.body.discount),
//       await order.save();
//     res.status(200).json({ result: order, status: "success" });
//   } catch (error) {
//     res.status(500).json({
//       message: "La commande est introuvable !",
//       status: "error",
//       error: error.message,
//     });
//   }
// };

//update Order
const updateOrder = async (req, res) => {
  try {
    const productIds = req.body.products.map((product) => product.id_product);
    const order = await Order.findById(req.params.id).populate("restorant");
    const restorant = await Restorant.findById(order.restorant);
    console.log("restorant", restorant);
    let deliveryPerson = null;

    if (req.body.delivery_person) {
      deliveryPerson = {
        id_delivery_person: req.body.delivery_person.id_delivery_person,
        firstname: req.body.delivery_person.firstname,
        lastname: req.body.delivery_person.lastname,
        phone_delivery: req.body.delivery_person.phone_delivery,
        email: req.body.delivery_person.email,
      };
    } else if (order.delivery_person) {
      deliveryPerson = order.delivery_person;
    }

    order.restorant = req.body.restorant;
    order.order_state = req.body.order_state;
    order.paid = req.body.paid;
    order.products = productIds;
    order.customer = {
      id_customer: req.body.customer.id_customer,
      firstname: req.body.customer.firstname,
      lastname: req.body.customer.lastname,
      gender: req.body.customer.gender,
      birthday: req.body.customer.birthday,
      phone: req.body.customer.phone,
      email: req.body.customer.email,
    };
    order.address = {
      street: req.body.address.street,
      postal_code: req.body.address.postal_code,
      city: req.body.address.city,
      street_number: req.body.address.street_number,
      lati: req.body.address.lati,
      longi: req.body.address.longi,
    };
    order.delivery_person = deliveryPerson;
     order.invoice_number = order.invoice_number;
    order.discount = req.body.discount;
    await order.save();

    // Envoyer les notifications si l'état de la commande est "PREPARED"
    if (order.order_state === "PAID") {
      const customerNotificationMessage = {
        Titre: "Commande payée",
        message: "Vous avez payé la commande numéro " + order.invoice_number,
      };
      const customerNotification = new Notification({
        id_user: order.customer.id_customer,
        type: "order",
        message: JSON.stringify(customerNotificationMessage),
        read: false,
      });
      await customerNotification.save();

      const restorerNotificationMessage = {
        Titre: "Nouvelle commande",
        message: "Vous avez reçu une nouvelle commande : " + order.invoice_number + ".",
      };
      const restorerNotification = new Notification({
        id_user: restorant.restorer.id_user,
        type: "order",
        message: JSON.stringify(restorerNotificationMessage),
        read: false,
      });
      await restorerNotification.save();
    }

    // Envoyer les notifications si l'état de la commande est "PREPARED"
    if (order.order_state === "PREPARED") {
      const customerNotificationMessage = {
        Titre: "Commande en cours de préparation",
        message: "Votre commande numéro " + order.invoice_number + " est en cours de préparation.",
      };
      const customerNotification = new Notification({
        id_user: order.customer.id_customer,
        type: "order",
        message: JSON.stringify(customerNotificationMessage),
        read: false,
      });
      await customerNotification.save();

      const restorerNotificationMessage = {
        Titre: "Commande prise en charge",
        message: "Vous avez pris en charge la commande numéro " + order.invoice_number + ".",
      };
      const restorerNotification = new Notification({
        id_user: restorant.restorer.id_user,
        type: "order",
        message: JSON.stringify(restorerNotificationMessage),
        read: false,
      });
      await restorerNotification.save();
    }

    if (order.order_state === "RACING") {
      const customerNotificationMessage = {
        Titre: "Commande en cours de livraison",
        message: "Votre commande numéro " + order.invoice_number + " est en en train d'arriver à votre adresse.",
      };
      const customerNotification = new Notification({
        id_user: order.customer.id_customer,
        type: "order",
        message: JSON.stringify(customerNotificationMessage),
        read: false,
      });
      await customerNotification.save();

      const restorerNotificationMessage = {
        Titre: "Commande envoyé au livreur",
        message: "Le livreur à pris en charge la commande numéro " + order.invoice_number + ".",
      };
      const restorerNotification = new Notification({
        id_user: restorant.restorer.id_user,
        type: "order",
        message: JSON.stringify(restorerNotificationMessage),
        read: false,
      });
      await restorerNotification.save();

      // Créer une notification pour le livreur
      const deliveryPersonNotificationMessage = {
        Titre: "Commande à livrer",
        message: "Vous êtes en train de livrer la commande numéro " + order.invoice_number + ".",
      };
      const deliveryPersonNotification = new Notification({
        id_user: order.delivery_person.id_delivery_person,
        type: "order",
        message: JSON.stringify(deliveryPersonNotificationMessage),
        read: false,
      });

      await deliveryPersonNotification.save();
    }

    if (order.order_state === "DELIVERED") {
      const customerNotificationMessage = {
        Titre: "Commande livrée",
        message: "Votre commande numéro " + order.invoice_number + " est arrivée à destination.",
      };
      const customerNotification = new Notification({
        id_user: order.customer.id_customer,
        type: "order",
        message: JSON.stringify(customerNotificationMessage),
        read: false,
      });
      await customerNotification.save();

      const restorerNotificationMessage = {
        Titre: "Commande livrée",
        message: "Le livreur à livré la commande " + order.invoice_number + ".",
      };
      const restorerNotification = new Notification({
        id_user: restorant.restorer.id_user,
        type: "order",
        message: JSON.stringify(restorerNotificationMessage),
        read: false,
      });
      await restorerNotification.save();

      // Créer une notification pour le livreur
      const deliveryPersonNotificationMessage = {
        Titre: "Commande livrée",
        message: "Vous avez livré la commande numéro " + order.invoice_number + ".",
      };
      const deliveryPersonNotification = new Notification({
        id_user: order.delivery_person.id_delivery_person,
        type: "order",
        message: JSON.stringify(deliveryPersonNotificationMessage),
        read: false,
      });
      
      await deliveryPersonNotification.save();
    }

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
      order.order_state = "TAKEN";
      
    // console.log('ajout', order.delivery_person.id_delivery_person);
      order.delivery_person = {
        id_delivery_person: req.body.delivery_person.id_delivery_person,
        firstname: req.body.delivery_person.firstname,
        lastname: req.body.delivery_person.lastname,
        phone_delivery: req.body.delivery_person.phone_delivery,
        email: req.body.delivery_person.email,
      };
      await order.save();
      const customerNotificationMessage = {
        Titre: "Livreur attribué",
        message: "Un livreur a été attribué à votre commande du numéro : " + order.invoice_number + ".",
      };
      const customerNotification = new Notification({
        id_user: order.customer.id_customer,
        type: "order",
        message: JSON.stringify(customerNotificationMessage),
        read: false,
      });
      await customerNotification.save();
  
      // Créer une notification pour le livreur
      const deliveryPersonNotificationMessage = {
        Titre: "Nouvelle commande",
        message: "Vous avez été attribué pour prendre en charge une nouvelle commande. Celle du numéro : " + order.invoice_number + ".",
      };
      const deliveryPersonNotification = new Notification({
        id_user: order.delivery_person.id_delivery_person,
        type: "order",
        message: JSON.stringify(deliveryPersonNotificationMessage),
        read: false,
      });
      await deliveryPersonNotification.save();
  
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


// // Historique des commandes d'un client en vérifiant que c'est bien order_state = DELIVERED et date_out = null
// const getOrdersWithProductsAndRestorantsByCustomerId = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       customer: req.params.id,
//       order_state: "DELIVERED",
//       date_out: null,
//     })
//       .populate("products")
//       .populate("restorant");
//     const count = await Order.countDocuments({
//       customer: req.params.id,
//       order_state: "DELIVERED",
//       date_out: null,
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

// Historique des commandes d'un client en vérifiant que c'est bien order_state = DELIVERED et date_out = null
const getOrdersWithProductsAndRestorantsByCustomerId = async (req, res) => {
  try {
    const orders = await Order.find({
      "customer.id_customer": req.params.id,
      order_state: "DELIVERED",
      date_out: null,
    })
      .populate("products")
      .populate("restorant");
    const count = await Order.countDocuments({
      "customer.id_customer": req.params.id,
      order_state: "DELIVERED",
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

// Afficher les commandes non payées d'un client
const getOrdersNotPaidByCustomerId = async (req, res) => {
  try {
    const orders = await Order.find({
      "customer.id_customer": req.params.id,
      order_state: "CREATED",
      date_out: null,
    })
      .populate("products")
      .populate("restorant");
    const count = await Order.countDocuments({
      "customer.id_customer": req.params.id,
      order_state: "CREATED",
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

// afficher plusieurs commandes d'un client avec les produits et le restorant associé à la commande avec date_out null
const getOrdersByCustomerId = async (req, res) => {
  try {
    const orders = await Order.find({
      date_out: null,
      "customer.id_customer": req.params.id,
    })
      .populate("products")
      .populate("restorant");
    const count = await Order.countDocuments({
      date_out: null,
      "customer.id_customer": req.params.id,
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

// afficher les dernières commandes passer durant le mois d'un restorant, avec le nombre de commandes par mois sur 1 an, les 10 produits les plus commandés en tout
const getStatisticRestaurant = async (req, res) => {
  const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
  const oneYearAgo = moment().subtract(1, 'year').startOf('month').toDate();

  try {
      const ordersLast30Days = await Order.find({
          restorant: req.params.id,
          date_in: { $gte: thirtyDaysAgo }
      });
      const ordersLast30DaysResult = {};
      ordersLast30Days.forEach(order => {
          const day = moment(order.date_in).format('DD/MM');
          if (!ordersLast30DaysResult[day]) ordersLast30DaysResult[day] = 0;
          ordersLast30DaysResult[day]++;
      });

      const ordersLastYear = await Order.find({
          restorant: req.params.id,
          date_in: { $gte: oneYearAgo }
      });
      const ordersLastYearResult = {};
      ordersLastYear.forEach(order => {
          const month = moment(order.date_in).format('MM/YYYY');
          if (!ordersLastYearResult[month]) ordersLastYearResult[month] = 0;
          ordersLastYearResult[month]++;
      });

      const allOrders = await Order.find({ restorant: req.params.id }).populate('products');
      const productCounts = {};
      allOrders.forEach(order => {
          order.products.forEach(product => {
              if (!productCounts[product.product_name]) productCounts[product.product_name] = 0;
              productCounts[product.product_name]++;
          });
      });
      const mostUsedProducts = Object.entries(productCounts)
          .sort(([,a],[,b]) => b-a)
          .slice(0, 10)
          .map(([product, count], index) => ({ rank: index + 1, product, count }));

      res.status(200).json({
          status: "success",
          result: {
              ordersLast30Days: Object.entries(ordersLast30DaysResult).map(([day, count]) => ({ day, count })),
              ordersByMonth: Object.entries(ordersLastYearResult).map(([month, count]) => ({ month, count })),
              mostUsedProducts,
          }
      });

  } catch (error) {
      res.status(500).json({
          message: "Erreur lors de la récupération des statistiques du restaurant.",
          status: "error",
          error: error.message,
      });
  }
};

const getOrdersByDeliveryId = async (req, res) => {
  try {
    const orders = await Order.find({
      date_out: null,
      "delivery_person.id_delivery_person": req.params.id,
      order_state: "RACING",
    })
      .populate("products")
      .populate("restorant");
    const count = await Order.countDocuments({
      date_out: null,
      "delivery_person.id_delivery_person": req.params.id,
      order_state: "RACING",
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

const getStatisticCommercial = async (req, res) => {
  try {
    // Inscriptions de restaurant ces 12 derniers mois
    const registrationsLast12Months = await Restorant.find({
      date_in: { $gte: moment().subtract(1, 'year').startOf('month').toDate() }
    }).countDocuments();

    // Nombre de commandes passées par jour (30 derniers jours) et par mois
    const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
    const ordersLast30Days = await Order.aggregate([
      {
        $match: {
          date_in: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%d/%m', date: '$date_in' }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const oneYearAgo = moment().subtract(1, 'year').startOf('month').toDate();
    const ordersLastYear = await Order.aggregate([
      {
        $match: {
          date_in: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%m/%Y', date: '$date_in' }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Nombre de commandes passées au total 
    const totalOrders = await Order.find().countDocuments();

    // Nombre de commandes passées par le client en created
    const createdOrders = await Order.find({
      order_state: 'CREATED'
    }).countDocuments();

    // // Nombre de commandes en cours de préparation
    // const paidOrders = await Order.find({
    //   order_state: 'PAID'
    // }).countDocuments();

    // Nombre de commandes en cours de préparation
    const preparingOrders = await Order.find({
      order_state: 'PREPARED'
    }).countDocuments();

    // Nombre de commandes acceptées pour livraison
    const takenOrders = await Order.find({
      order_state: 'TAKEN'
    }).countDocuments();

    // Nombre de commandes en cours de livraison
    const racingOrders = await Order.find({
      order_state: 'RACING'
    }).countDocuments();

    // Nombre de commandes livrées
    const deliveredOrders = await Order.find({
      order_state: 'DELIVERED'
    }).countDocuments();

    // Nombre de commandes en cours (non livrées)
    const nodeliveredOrders = createdOrders + preparingOrders + takenOrders + racingOrders;

    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();
    const totalAmountEarnedLast7Days = await Order.aggregate([
      {
        $match: {
          date_in: { $gte: sevenDaysAgo },
          order_state: { $in: ['PAID', 'TAKEN', 'RACING', 'DELIVERED'] } // si order_state est soit PAID, TAKEN, RACING ou DELIVERED
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $group: {
          _id: null,
          totalAmountEarned: { $sum: '$productDetails.product_price' }
        }
      }
    ]);
    
    const totalAmountEarnedLast7DaysValue = totalAmountEarnedLast7Days.length > 0 ? totalAmountEarnedLast7Days[0].totalAmountEarned : 0;
     console.log(totalAmountEarnedLast7DaysValue);
    res.status(200).json({
      status: 'success',
      result: {
        registrationsLast12Months,
        ordersLast30Days,
        ordersLastYear,
        totalOrders,
        createdOrders,
        // paidOrders,
        preparingOrders,
        takenOrders,
        racingOrders,
        deliveredOrders,
        nodeliveredOrders,
        totalAmountEarnedLast7Days: totalAmountEarnedLast7DaysValue
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques commerciales.',
      status: 'error',
      error: error.message
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
  getStatisticRestaurant,
  getOrdersByCustomerId,
  getOrdersByDeliveryId,
  getStatisticCommercial,
  getOrdersNotPaidByCustomerId,
};
