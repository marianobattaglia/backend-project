// ---- IMPORTS ----
// Libraries
const fs = require("fs");
const express = require("express");
// Classes
const FileManager = require("./src/FileManager");
const CartManager = require("./src/CartManager");

// ---- FileSystem ----
const productsRoute = "./public/fileSystem/products.txt";
const cartRoute = "./public/fileSystem/cart.txt";

// ---- File Management Classes ----
const fileManager = new FileManager(productsRoute);
const cartManager = new CartManager(cartRoute);

// ---- Express Server initialization ----
const PORT = process.env.PORT || 8080;
const app = express();

// ---- Middleware para lectura de Json desde servidor ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Routers Config ----
const { Router } = express;
// Products
const routerProducts = Router();
app.use("/api/productos", routerProducts);
// Carts
const routerShopCart = Router();
app.use("/api/carrito", routerShopCart);

//Middleware para acceso a carpeta public
app.use("/public", express.static(__dirname + "/public"));

// ---- Server Initialization ----
const server = app.listen(PORT, () => {
  console.log(`Server Listening on ${server.address().port}`);
});

// ---- Error Manager ----
server.on("error", (error) => console.log(`Error on Server: ${error}`));

// ---- Administrator Manager ----
let isAdmin = true;

// ---- HTML Route ----
app.get("/public", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ##############################################################################
// ##############################################################################
// ##############################################################################

// ---- Products ----

// GET all Products
routerProducts.get("/", (req, res) => {
  let products = fileManager.getAll();
  res.json(products);
});

// GET product by ID
routerProducts.get("/:id", (req, res) => {
  const { id } = req.params;
  let productFound = fileManager.getById(id);
  res.json(productFound);
});

// POST product (Only works for Administrator)
routerProducts.post(
  "/",
  (req, res, next) => {
    if (!isAdmin) {
      res.send({
        error: -1,
        descripcion: `ruta ${req.baseUrl} método ${req.method} no autorizada`,
      });
    } else {
      next();
    }
  },
  (req, res) => {
    const { body } = req;
    //Check de si estan todas las props necesarias
    //let keys = Object.keys(body);
    //let check = (arr, target) => target.every((e) => arr.includes(e));
    //let validation = check(keys, necessaryProps);

    //if (validation) {
    fileManager.saveProduct(body);
    let products = fileManager.getAll();
    res.json(products);
    //} else {
    //  res.json("Las props no son iguales");
    //}
  }
);

// PUT product
routerProducts.put(
  "/:id",
  (req, res, next) => {
    if (!isAdmin) {
      res.send({
        error: -1,
        descripcion: `ruta ${req.baseUrl} método ${req.method} no autorizada`,
      });
    } else {
      next();
    }
  },
  (req, res) => {
    const { id } = req.params;
    const { body } = req;
    let puttedProduct = fileManager.updateById(id, body);
    res.json(puttedProduct);
  }
);

// DELETE product by ID
routerProducts.delete(
  "/:id",
  (req, res, next) => {
    if (!isAdmin) {
      res.send({
        error: -1,
        descripcion: `ruta ${req.baseUrl} método ${req.method} no autorizada`,
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
// ##############################################################################

// ---- Carts ----

// GET Carts
routerShopCart.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json(id);
});

// POST Cart
routerShopCart.post("/", (req, res) => {
  let newCart = cartManager.saveCart();
  res.json(newCart);
});

// DELETE Cart by ID
routerShopCart.delete("/:id", (req, res) => {
  const { id } = req.params;
  let cartList = cartManager.deleteCartById(id);
  res.json(cartList);
});

// GET Cart by ID
routerShopCart.get("/:id/productos", (req, res) => {
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

// POST Products to Cart by ID
routerShopCart.post("/:id/productos", (req, res) => {
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

// DELETE Products in Cart by ID
routerShopCart.delete("/:id/productos/:id_prod", (req, res) => {
  const { id, id_prod } = req.params;
  let newCartList = cartManager.deleteProdInCart(id, id_prod);
  res.json(newCartList);
});

///////// ESTRUCTURA DE PRODUCTO
// let product = {
//   id: 1,
//   timestamp: new Date(),
//   name: "producto1",
//   description: "es un buen producto",
//   code: 123,
//   thumbnail: "www.google.com",
//   price: 120,
//   stock: 100,
// };

///////// ESTRUCTURA DE CARRITO
// let product = {
//   id: 1,
//   timestamp: new Date(),
//   products: [{
// //   id: 1,
// //   timestamp: new Date(),
// //   name: "product1"
// //   description: "es un buen producto",
// //   code: 123,
// //   thumbnail: "www.google.com",
// //   price: 120,
// //   stock: 100,
//      }]
// };

let necessaryProps = [
  "name",
  "description",
  "code",
  "thumbnail",
  "price",
  "stock",
];

app.all("*", (req, res) => {
  res.status(404).json({
    error: -1,
    descripcion: `ruta ${req.url} método ${req.method} no autorizada`,
  });
});
