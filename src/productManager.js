const fs = require("fs");

class FileManager {
  constructor(file) {
    this.file = file;
  }

  // GET all products stored
  getAll = () => {
    try {
      let data = fs.readFileSync(this.file, "utf-8");
      let parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.log("Error. Can't GET products.");
      console.log(error);
    }
  };

  // GET a product stored by ID
  getById = (id) => {
    try {
      let productList = this.getAll();
      let productFound = productList.find((element) => element.id == id);
      if (productFound == undefined) {
        return { error: `Product not found by ID: ${id}`, code: 0 };
      }
      return productFound;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  // SAVE and store product in product list
  saveProduct = (object) => {
    try {
      let productList = this.getAll();

      if (productList.length > 0) {
        // If is productList stored
        let newObj = {
          id: productList[productList.length - 1].id + 1,
          timestamp: new Date(),
          ...object,
        };
        productList.push(newObj);
        const productsJson = JSON.stringify(productList, null, 2);
        fs.writeFileSync(this.file, productsJson);
        console.log(`New product added: ${newObj.id}`);
        return productList;
      } else {
        // There is no productList stored, create one
        let productList = [];

        let newObj = {
          id: 1,
          timestamp: new Date(),
          ...object,
        };
        productList.push(newObj);
        const productsJson = JSON.stringify(productList, null, 2);
        fs.writeFileSync(this.file, productsJson);
        console.log(`New product added: ${newObj.title}`);
        return productList;
      }
    } catch (err) {
      let productList = [];
      let newObj = {
        id: 1,
        timestamp: new Date(),
        ...object,
      };
      productList.push(newObj);
      fs.writeFileSync(this.file, JSON.stringify(productList, null, 2));
      return productList;
    }
  };

  // UPDATE a product
  updateById = (id, objUpdate) => {
    try {
      let productList = this.getAll();
      let productToUpdate = productList.find((element) => element.id == id);
      let productIndex = productList.findIndex((element) => element.id == id);
      if (productList[productIndex]) {
        productList[productIndex] = {
          ...productList[productIndex],
          ...objUpdate,
        };
      } else {
        throw error;
      }
      this.deleteAll();
      fs.writeFileSync(this.file, JSON.stringify(productList, null, 2));
      return productList[productIndex];
    } catch (error) {
      console.log(error);
      return `Product ID ${id} not found`;
    }
  };

  // DELETE a product
  deleteById = (id) => {
    try {
      let productList = this.getAll();
      let productToDelete = productList.findIndex(
        (element) => element.id == id
      );
      if (productToDelete + 1 !== 0) {
        this.deleteAll;
        productList.splice(productToDelete, 1);
        fs.writeFileSync(this.file, JSON.stringify(productList, null, 2));
        return productList;
      } else {
        throw error;
      }
    } catch (error) {
      return `Product ID ${id} not found`;
    }
  };

  // DELETE all products stored
  deleteAll = () => {
    let arr = [];
    fs.writeFileSync(this.file, JSON.stringify(arr));
  };
}

module.exports = FileManager;
