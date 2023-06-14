const MongoClient = require('mongodb').MongoClient;

// URL de connexion à la base de données MongoDB
const url = 'mongodb://admin:password@mongodb:27017/?authMechanism=DEFAULT';

// Nom de la base de données
const dbName = 'cesi-order';

// Créer une fonction pour exécuter le script
async function createDatabase() {
  // Créer une instance du client MongoDB
  const client = new MongoClient(url);

  try {
    // Se connecter au serveur MongoDB
    await client.connect();
    console.log('Connexion réussie à la base de données.');

    // Créer une nouvelle base de données
    const db = client.db(dbName);

    // Créer les collections
    await db.createCollection('orders');
    await db.createCollection('products');
    await db.createCollection('restorants');

    // Insérer des documents dans la collection 'orders'
    await db.collection('orders').insertMany([
        {
            "id_restorant": "609b6b7f5be92d001fd8d3a4",
            "order_state": "En cours",
            "products": [
                {
                    "id_product": "6482e92ebddd4342c664605c"
                },
                {
                    "id_product": "6482e99bbddd4342c6646064"
                }
                ],
            "customer": {
                "id_customer" : 1,
                "firstname": "Machin",
                "lastname": "Machin",
                "gender": "Male",
                "birthday": "2000-09-05",
                "phone": "0667207514",
                "email": "machine.machine@hotmail.fr"
            },
            "address": {
                "id_address" : 1,
                "street": "Rue de Machin",
                "postal_code": 51100,
                "city": "Reims",
                "street_number": 20,
                "lati": -55.1,
                "longi": -52.3
            },
            "delivery_person": {
                "id_delivery_person" : 1,
                "firstname": "Machinliv",
                "lastname": "Machinliv"
            },
            "invoice_number": "A3DCHGT",
            "discount": 5
        },
        {
            "id_restorant": "609b6b7f5be92d001fd8d3a3",
            "order_state": "En cours",
            "products": [
                {
                    "id_product": "6482e92ebddd4342c664606c"
                },
                ],
            "customer": {
                "id_customer" : 3,
                "firstname": "Machin1",
                "lastname": "Machin1",
                "gender": "Male",
                "birthday": "2000-09-05",
                "phone": "0667207520",
                "email": "machin1.machin@1hotmail.fr"
            },
            "address": {
                "id_address" : 1,
                "street": "Rue de Machin",
                "postal_code": 51200,
                "city": "Reims",
                "street_number": 25,
                "lati": -75.1,
                "longi": -72.3
            },
            "delivery_person": {
                "id_delivery_person" : 5,
                "firstname": "Machinliv1",
                "lastname": "Machinliv1"
            },
            "invoice_number": "A3DCITH",
            "discount": 10
        },
    ]);

    // Insérer des documents dans la collection 'products'
    await db.collection('products').insertMany([
      { "id_restorant" : "609b6b7f5be92d001fd8d3a4",
      "product_name" : "Carotte",
      "product_price" : 10,
      "product_category" : "Légume"
     },
      { "id_restorant" : "609b6b7f5be92d001fd8d3a4",
      "product_name" : "Patate",
      "product_price" : 15,
      "product_category" : "Légume"
     },
     { "id_restorant" : "609b6b7f5be92d001fd8d3a3",
      "product_name" : "Nouille",
      "product_price" : 5,
      "product_category" : "Féculent"
     },
    ]);

    // Insérer des documents dans la collection 'restorants'
    await db.collection('restorants').insertMany([
        { "restorant_name" : "Boucherie",
        "restorant_type" : "viande",
        "phone_number" : "0667207514"
        },
        { "restorant_name" : "Italiano Pasta",
        "restorant_type" : "Pasta",
        "phone_number" : "0620751480"
        },
      ]);

    console.log('Base de données créée avec succès.');
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  } finally {
    // Fermer la connexion
    await client.close();
  }
}

// Appeler la fonction pour créer la base de données
createDatabase();