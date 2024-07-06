const express = require("express");
const path = require("path");
const connectDB = require("./database");

//const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const groupRoutes = require("./routes/group");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Perform any necessary cleanup, logging, or notifications
  // Optionally, restart the application or perform other recovery actions
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Perform any necessary cleanup, logging, or notifications
  // Optionally, restart the application or perform other recovery actions
});

//Create app
const app = express();

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.append(
    "Access-Control-Allow-Headers",
    "Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, Referer, User-Agent"
  );
  next();
});

//Configure app
const port = 3000;

//Connect to MongoDB

app.listen(port, () => {
  console.log("Server is running on port", port);
  connectDB();
});

//Mount middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public"))); // Nifty feature that allows user to skip writing long directories

app.use("/", userRoutes);
app.use("/", groupRoutes);

//Start the server
