const mongoose = require('mongoose');

// Chaîne de connexion MongoDB
const mongoURI = "mongodb://admin:password@mongodb:27017/?authMechanism=DEFAULT";


// Connexion à la base de données MongoDB
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'cesi-order',
    })
    .then(() => {
        console.log('Connecté à la base de données MongoDB');
        // Votre code ici pour interagir avec la base de données
    })
    .catch((error) => {
        console.error('Erreur de connexion à la base de données MongoDB:', error);
        throw new Error("Failed to connect to the database"); // Génère une erreur et arrête l'exécution du serveur Node
    });