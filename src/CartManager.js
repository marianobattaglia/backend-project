const fs = require("fs");

class CartManager {
  constructor(file) {
    this.file = file;
  }

  // GET all carts
  getAll = () => {
    try {
      let data = fs.readFileSync(this.file, "utf8");
      let parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.log("Error. Can't GET carts");
      console.log(error);
    }
  };

  // GET cart by ID
  getCartById = (id) => {
    try {
      let cartList = this.getAll();
      let cartFound = cartList.find((element) => element.id == id);

      if (cartFound == undefined) {
        return undefined;
      } else {
        return cartFound;
      }
    } catch (error) {
      return error;
    }
  };

  // SAVE cart
  saveCart = (object) => {
    try {
      let cartList = this.getAll();
      // If there is a cartList created, create a new element and store it
      if (cartList.length > 0) {
        let newCart = {
          id: cartList[cartList.length - 1].id + 1,
          timestamp: new Date(),
          productos: [],
        };
        cartList.push(newCart);
        const productsJson = JSON.stringify(cartList, null, 2);
        fs.writeFileSync(this.file, productsJson);
        console.log(`New Cart created, ID: ${newCart.id}`);
        return cartList;
      } else {
        // If there isn't cartList created, create one and store it
        let cartList = [];
        let newCart = {
          id: 1,
          timestamp: new Date(),
          productos: [],
        };
        cartList.push(newCart);
        const productsJson = JSON.stringify(cartList, null, 2);
        fs.writeFileSync(this.file, productsJson);
        console.log(`New Cart created, ID: ${newCart.id}`);
        return cartList;
      }
    } catch (error) {
      let cartList = [];
      let newCart = {
        id: 1,
        timestamp: new Date(),
        productos: [],
      };
      cartList.push(newCart);
      fs.writeFileSync(this.file, JSON.stringify(cartList, null, 2));
      return cartList;
    }
  };

  // DELETE cart by ID
  deleteCartById = (id) => {
    try {
      let cartList = this.getAll();
      let cartIndex = cartList.findIndex((element) => element.id == id);
      if (cartIndex + 1 !== 0) {
        this.deleteAll;
        cartList.splice(cartIndex, 1);
        fs.writeFileSync(this.file, JSON.stringify(cartList, null, 2));
        return cartList;
      } else {
        throw error;
      }
    } catch (error) {
      return `Cart ID ${id} not found`;
    }
  };

  // DELETE ALL Carts stored
  deleteAllCarts = () => {
    let cartList = [];
    fs.writeFileSync(this.file, JSON.stringify(cartList));
  };

  // SAVE product to cart
  saveProductToCart = (id, product) => {
    let cartSelected = this.getCartById(id);
    cartSelected.productos.push(product);

    let cartList = this.getAll();
    let index = cartList.findIndex((e) => e.id == id);
    cartList[index].productos = cartSelected.productos;

    this.deleteAllCarts();
    fs.writeFileSync(this.file, JSON.stringify(cartList, null, 2));
    return cartList;
  };

  // DELETE a product in Cart
  deleteProdInCart = (id, id_prod) => {
    let cartList = this.getAll();
    let cartIndex = cartList.findIndex((e) => e.id == id);
    let productIndexFromSelectedCart = cartList[cartIndex].productos.findIndex(
      (e) => e.id == id_prod
    );
    // Delete product from cart (if it exist)
    if (productIndexFromSelectedCart >= 0) {
      cartList[cartIndex].productos.splice(productIndexFromSelectedCart, 1);
      this.deleteAllCarts();
      fs.writeFileSync(this.file, JSON.stringify(cartList, null, 2));
      return cartList;
    } else {
      return `Product ID ${id_prod} not found`;
    }
  };
}

module.exports = CartManager;
