/* ---- IMPORTS ---- */
/* Libraries */
const express = require("express");

/* ---- Express Server initialization ---- */
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---- Routers Config ---- */
/* Products */
const routerProducts = require("./routers/product");
app.use("/api/productos", routerProducts);
/* Carts */
const routerCarts = require("./routers/cart");
app.use("/api/carritos", routerCarts);

/* ---- Server Initialization ---- */
const server = app.listen(PORT, () => {
  console.log(`Server Listening on PORT ${server.address().port}`);
});
/* Error Manager */
server.on("error", (error) => console.log(`Error on Server: ${error}`));

/* ---- Code 404 response ---- */
app.all("*", (req, res) => {
  res.status(404).json({
    error: -1,
    descripcion: `Route ${req.baseUrl} method ${req.method} unautorized.`,
  });
});
