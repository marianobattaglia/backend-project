/* ---- Imports ---- */
const express = require("express");
const { productDaos: ProductManager } = require("../daos/mainDaos");

const routerProducts = express.Router();
const productManager = new ProductManager();

/* ---- Administrator Manager ---- */
const isAdministrator = true;

const checkAdmin = (req, res, next) => {
  if (isAdministrator) {
    next();
    return;
  } else {
    res.status(403).send({
      error: -1,
      descripcion: `ruta ${req.baseUrl} método ${req.method} no autorizada`,
    });
  }
};

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

/* GET all Products */
routerProducts.get("/", async (req, res) => {
  try {
    let productList = await productManager.getAll();
    res.status(200).send({
      status: 200,
      data: { productList },
      message: "Get successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

/* GET product by ID */
routerProducts.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let productFound = await productManager.getById(id);
    res.status(200).send({
      status: 200,
      data: { productFound },
      message: "Get successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

/* POST product (Only works for Administrator) */
routerProducts.post("/", checkAdmin, async (req, res) => {
  try {
    const { body } = req;
    //Check de si estan todas las props necesarias
    let keys = Object.keys(body);
    let matchParams = (arr, target) => target.every((e) => arr.includes(e));
    let validatedObject = matchParams(keys, bodyRequirements);
    if (validatedObject) {
      await productManager.save(body);
      let products = await productManager.getAll();
      res.status(200).send({
        status: 200,
        data: { products },
        message: "Uploaded Product",
      });
    } else {
      res.status(500).send({
        status: 500,
        message: `The object you are trying to upload does not meet the requirements. Remember to send the required parameters: ${bodyRequirements}.`,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

/* PUT product (Only works for Administrator) */
routerProducts.put("/:id", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    let updatedProduct = await productManager.updateById(id, body);
    res.status(200).send({
      status: 200,
      data: { product: updatedProduct },
      message: "Updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

/* DELETE product by ID (Only works for Administrator) */
routerProducts.delete("/:id", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let deletedProduct = await productManager.deleteById(id);
    res.status(200).send({
      status: 200,
      data: { id: deletedProduct },
      message: `Product Deleted successfully`,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

module.exports = routerProducts;
