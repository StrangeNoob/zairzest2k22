const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const AdminBro = require("admin-bro");
const AdminBroExpress = require("admin-bro-expressjs");
const AdminBroMongoose = require("admin-bro-mongoose");

const config = require("./config");
const routes = require("./routes");
const { Counter, Users, Team, Events } = require("./models");

const main = async () => {
  try {
    const app = express();

    const connection = await mongoose.connect(config.mongoose, {
      useNewUrlParser: true,
    });

    AdminBro.registerAdapter(AdminBroMongoose);

    const adminBro = new AdminBro({
      databases: [connection],
      resources: [Users, Team, Events],
      rootPath: "/admin",
      branding: {
        companyName: "Zairza",
        logo: false,
        softwareBrothers: false,
      },
    });
    const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
      authenticate: async (email, password) => {
        if (
          config.admin.email === email &&
          config.admin.password === password
        ) {
          return true;
        }
        return false;
      },
      cookiePassword: config.jwtSecret,
    });

    app.use(adminBro.options.rootPath, router);
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors());

    app.use("/auth", routes.auth);
    app.use("/event", routes.event);

    app.get("*", function (req, res) {
      res.status(404).json({
        message: "Not Found",
      });
    });
    Counter.findOrCreate({ _id: "entityId" }, (err, doc) => {
      app.listen(config.port || 3000, () => {
        console.log(
          `🚀  Server started at http://${config.host}:${config.port} 🚀`
        );
      });
    });
  } catch (err) {
    console.log("Error:", err);
  }
};

main();
