const fs = require("fs");
const { normalizeAndDenormalize } = require("../utils/normalizr");

class ApiChat {
  async writeChatToFile(message) {
    try {
      // ---- Normalize data ----
      const messagesNormalized = normalizeAndDenormalize("normalize", message);
      await fs.promises.writeFile(
        "./data/chat.json",
        JSON.stringify(messagesNormalized)
      );
    } catch (err) {
      console.log("Can't write file. Error: " + err);
    }
  }

  async readChatFromFile() {
    try {
      // ---- Read from normalized ----
      const message = await fs.promises.readFile("./data/chat.json");
      const messageList = JSON.parse(message);
      // ---- Denormalize ----
      const messagesDenormalized = normalizeAndDenormalize(
        "denormalize",
        messageList
      );
      return messagesDenormalized;
    } catch (err) {
      console.log("Can't write file. Error: " + err);
    }
  }
}

module.exports = ApiChat;
