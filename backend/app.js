const express = require("express");
const app = express();
const errorMiddleware = require("../backend/middleware/error");
const cookiePars = require("cookie-parser");

app.use(express.json());
app.use(cookiePars());

//Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoutes");

app.use("/api/v1",product);
app.use("/api/v1",user)

//Middleware for Errors
app.use(errorMiddleware);

module.exports = app