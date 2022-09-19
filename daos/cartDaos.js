////@ts-check
/* ---- IMPORTS ---- */
const admin = require("firebase-admin");
const serviceAccount = require("./db/backend-coder-mb-firebase-adminsdk-ytw52-a66848a9e7.json");
const ProductManager = require("./productDaos");
const productManager = new ProductManager();

/* ---- Cart Manager ---- */
class CartManager {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https:/backend-coder-mb.firebaseio.com",
    });
  }

  newCart = async () => {
    try {
      const db = admin.firestore();
      const query = db.collection("carritos");
      let time = new Date();
      const cart = await query.add({
        timestamp: time.toString(),
        productos: [],
      });
      return cart.id;
    } catch (error) {
      throw Error(error.message);
    }
  };

  getAll = async () => {
    try {
      const db = admin.firestore();
      const query = db.collection("carritos");
      const data = await query.get();
      let docs = data.docs;
      const carts = docs.map((doc) => ({
        id: doc.id,
        timestamp: doc.data().timestamp,
        products: doc.data().productos,
      }));

      return carts;
    } catch (error) {
      throw Error(error.message);
    }
  };

  getCartById = async (id) => {
    try {
      const db = admin.firestore();
      const query = db.collection("carritos");
      const doc = query.doc(String(id));
      const cart = await doc.get();
      const cartSelected = {
        id: cart.id,
        timestamp: cart.data().timestamp,
        productos: cart.data().productos,
      };
      return cartSelected;
    } catch (error) {
      throw Error(error.message);
    }
  };

  saveProductToCart = async (idCart, idProd) => {
    try {
      const db = admin.firestore();
      const cart = await db.collection("carritos").doc(String(idCart));
      const product = await productManager.getById(idProd);

      await cart.update({
        productos: admin.firestore.FieldValue.arrayUnion(
          JSON.parse(JSON.stringify(product))
        ),
      });
      let data = await cart.get();
      return data.data();
    } catch (error) {
      throw Error(error.message);
    }
  };

  deleteCartById = async (id) => {
    try {
      const db = admin.firestore();
      const query = db.collection("carritos");
      const doc = query.doc(String(id));
      const cart = await doc.get();
      const cartDeleted = {
        id: cart.id,
      };

      await doc.delete();
      return cartDeleted;
    } catch (error) {
      throw Error(error.message);
    }
  };

  deleteProdInCart = async (idCart, idProd) => {
    try {
      const db = admin.firestore();
      const query = db.collection("carritos");
      const cart = await query.doc(idCart);

      const product = await productManager.getById(idProd);

      await cart.update({
        productos: admin.firestore.FieldValue.arrayRemove(
          JSON.parse(JSON.stringify(product))
        ),
      });

      let data = await cart.get();
      return data.data();
    } catch (error) {
      throw Error(error.message);
    }
  };
}

module.exports = CartManager;
