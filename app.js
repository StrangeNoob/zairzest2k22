const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose =require('mongoose');
require('dotenv').config();
const config = require("./config");
const routes = require("./routes")

const main = async () => {
    try {

        const app = express();
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());

        app.use('/auth', routes.auth);

        mongoose.connect(config.mongoose,{ useNewUrlParser: true });
        
        app.listen(config.port || 3000,() => {
            console.log(`🚀  Server started at http://${config.host}:${config.port} 🚀`)
        })

    } catch (err) {
        console.log("Error:", err.message);
    }
}

main();
