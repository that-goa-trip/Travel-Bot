const express = require("express");
const http = require("http");
const cors = require("cors");
const SocketsController = require("./app/controllers/sockets");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/", require("./app/routes/index"));

const server = http.createServer(app);

const io = require("socket.io")(server, {
  allowEIO3: true,
});

SocketsController.init(io);

app.get("/status", (req, res) => {
  console.log(req);
  res.send({
    status: "ok",
  });
});

app.all("/*", (req, res) => {
  res.status(404).send({ errorCode: 3001, message: "INVALID_ENDPOINT" });
});

app.use((error, req, res, next) => {
  const errorCode = error.errno || 400;
  const message = error.message;
  return res.status(errorCode).json({
    success: false,
    errorCode,
    message,
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Socket server listening on port ${PORT}`);
});
