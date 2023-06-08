const mongoose = require("mongoose");
const express = require("express")
const port = 3000;


mongoose
    .connect("mongodb://127.0.0.1:27017/test_mongoose", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to MongoDB");
        const app = express()

        //middleware
        app.use(express.json());

        //routes
        // app.use(postRoutes);
        app.use(OrderRoutes);

        app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    })
    .catch(err => console.error("Connection error", err));
