const SocketsController = require("../controllers/sockets");

class Api {
  static emitToGroup(req, res) {
    const { group_id, event, data } = req.body;
    try {
      SocketsController.emitToGroup(group_id, event, data);
      res.status(200).json({ message: "Message sent!" });
    } catch (err) {
      console.log(err);
      res.status(200).json({ status: "failed" });
    }
  }
}

module.exports = Api;
