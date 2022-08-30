/* ---- IMPORTS ---- */
/* Libraries */
const fs = require("fs");
const express = require("express");
/* Classes */
const ProductManager = require("./src/productManager");
const CartManager = require("./src/cartManager");

/* ---- FileSystem ---- */
const productsRoute = "./public/fileSystem/products.txt";
const cartRoute = "./public/fileSystem/cart.txt";

/* ---- File Management Classes ---- */
const fileManager = new ProductManager(productsRoute);
const cartManager = new CartManager(cartRoute);

/* ---- Express Server initialization ---- */
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---- Routers Config ---- */
const { Router } = express;
/* Products */
const routerProducts = Router();
app.use("/api/productos", routerProducts);
/* Carts */
const routerCarts = Router();
app.use("/api/carritos", routerCarts);
app.use("/public", express.static(__dirname + "/public"));
/* HTML Route */
app.get("/public", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/* ---- Server Initialization ---- */
const server = app.listen(PORT, () => {
  console.log(`Server Listening on ${server.address().port}`);
});
/* Error Manager */
server.on("error", (error) => console.log(`Error on Server: ${error}`));

/* ---- Administrator Manager ---- */
let isAdministrator = true; /* Will be configured later with a login feature */

let bodyRequirements = [
  "name",
  "description",
  "code",
  "thumbnail",
  "price",
  "stock",
];

// ##############################################################################
// ##############################################################################

/* ---- Products ---- */

/* GET all Products */
routerProducts.get("/", (req, res) => {
  let products = fileManager.getAll();
  res.json(products);
});

/* GET product by ID */
routerProducts.get("/:id", (req, res) => {
  const { id } = req.params;
  let productFound = fileManager.getById(id);
  res.json(productFound);
});

/* POST product (Only works for Administrator) */
routerProducts.post(
  "/",
  (req, res, next) => {
    if (!isAdministrator) {
      res.send({
        error: -1,
        descripcion: `Route ${req.baseUrl} method ${req.method} unautorized.`,
      });
    } else {
      next();
    }
  },
  (req, res) => {
    const { body } = req;
    //Body params control from request
    let keys = Object.keys(body);
    let matchParams = (arr, target) => target.every((e) => arr.includes(e));
    let validatedObject = matchParams(keys, bodyRequirements);

    if (validatedObject) {
      fileManager.saveProduct(body);
      let products = fileManager.getAll();
      res.json(products);
    } else {
      res.json(
        `The object you are trying to upload does not meet the requirements. Remember to send the required parameters: ${bodyRequirements}.`
      );
    }
  }
);

/* PUT product */
routerProducts.put(
  "/:id",
  (req, res, next) => {
    if (!isAdministrator) {
      res.send({
        error: -1,
        descripcion: `Route ${req.baseUrl} method ${req.method} unautorized.`,
      });
    } else {
      next();
    }
  },
  (req, res) => {
    const { id } = req.params;
    const { body } = req;
    let updatedProduct = fileManager.updateById(id, body);
    res.json(updatedProduct);
  }
);

/* DELETE product by ID */
routerProducts.delete(
  "/:id",
  (req, res, next) => {
    if (!isAdministrator) {
      res.send({
        error: -1,
        descripcion: `Route ${req.baseUrl} method ${req.method} unautorized.`,
      });
    } else {
      next();
    }
  },
  (req, res) => {
    const { id } = req.params;
    let deletedProduct = fileManager.deleteById(id);
    res.json(deletedProduct);
  }
);

// ##############################################################################
// ##############################################################################

/* ---- Carts ---- */

/* GET Carts */
routerCarts.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json(id);
});

/* POST Cart */
routerCarts.post("/", (req, res) => {
  let newCart = cartManager.saveCart();
  res.json(newCart);
});

/* DELETE Cart by ID */
routerCarts.delete("/:id", (req, res) => {
  const { id } = req.params;
  let cartList = cartManager.deleteCartById(id);
  res.json(cartList);
});

/* GET Cart by ID */
routerCarts.get("/:id/productos", (req, res) => {
  const { id } = req.params;
  let cartProducts = cartManager.getCartById(id);

  if (cartProducts != undefined) {
    if (cartProducts.productos.length > 0) {
      res.json(cartProducts.productos);
    } else {
      res.json("Cart not found or there is no products in this cart");
    }
  } else {
    res.json("Cart not found or there is no products in this cart");
  }
});

/* POST Products to Cart by ID */
routerCarts.post("/:id/productos", (req, res) => {
  const { id } = req.params;
  const { body } = req;

  let productSelected = fileManager.getById(body.id);
  let cartProducts;

  if (productSelected.code != 0) {
    cartProducts = cartManager.saveProductToCart(id, productSelected);
    res.json(cartProducts);
  } else {
    res.json("Product not found");
  }
});

/* DELETE Products in Cart by ID */
routerCarts.delete("/:id/productos/:id_prod", (req, res) => {
  const { id, id_prod } = req.params;
  let newCartList = cartManager.deleteProdInCart(id, id_prod);
  res.json(newCartList);
});

// ##############################################################################
// ##############################################################################

/* ---- Code 404 response ---- */
app.all("*", (req, res) => {
  res.status(404).json({
    error: -1,
    descripcion: `Route ${req.baseUrl} method ${req.method} unautorized.`,
  });
});
