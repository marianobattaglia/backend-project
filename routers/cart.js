/* ---- Imports ---- */
const express = require("express");
const { cartDaos: CartManager } = require("../daos/mainDaos");

const routerCarts = express.Router();
const cartManager = new CartManager();

/* ---- GET ALL Carts: http://localhost:8080/api/carritos/ ---- */
routerCarts.get("/", async (req, res) => {
  try {
    let cartProducts = await cartManager.getAll();

    res.status(200).send({
      status: 200,
      data: {
        carts: cartProducts,
      },
      message: "Cart Found",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Cart doesn't exist",
    });
  }
});

/* ---- GET Cart by ID: http://localhost:8080/api/carritos/:id/productos ---- */
routerCarts.get("/:id/productos", async (req, res) => {
  const { id } = req.params;
  try {
    let cartProducts = await cartManager.getCartById(id);

    res.status(200).send({
      status: 200,
      data: {
        carts: cartProducts,
      },
      message: "Cart Found",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Cart nto found",
    });
  }
});

/* ---- POST CART / Create new cart: http://localhost:8080/api/carritos/ ---- */
routerCarts.post("/", async (req, res) => {
  try {
    let newCart = await cartManager.newCart();
    res.status(200).send({
      status: 200,
      data: {
        id: newCart,
      },
      message: "New cart created",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Cart is not created",
    });
  }
});

/* ---- DELETE by ID: http://localhost:8080/api/carritos/:id/ ---- */
routerCarts.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let deletedCart = await cartManager.deleteCartById(id);
    res.status(200).send({
      status: 200,
      data: {
        deletedCart: deletedCart,
      },
      message: "Cart deleted",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "The ID doesn't exist or Cart can't be deleted",
    });
  }
});

/* ---- POST Products to Cart by ID: http://localhost:8080/api/carritos/:id/productos ---- */
routerCarts.post("/:id/productos", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    let productSelected = await cartManager.saveProductToCart(id, body.id);
    res.status(200).send({
      status: 200,
      data: {
        productSelected,
      },
      message: "Product Charged",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

/* ---- DELETE Products in Cart by ID: http://localhost:8080/api/carritos/:idCarrito/productos/:idProducto ---- */
routerCarts.delete("/:id/productos/:idProd", async (req, res) => {
  try {
    const { id, idProd } = req.params;
    let newCartList = await cartManager.deleteProdInCart(id, idProd);
    res.status(200).send({
      status: 200,
      data: {
        newCartList,
      },
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

module.exports = routerCarts;
