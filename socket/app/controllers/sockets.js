class Socket {
  constructor(io) {
    this.io = null;
  }

  init(io) {
    this.io = io;

    this.io
      .use(function (socket, next) {
        console.log("here?");
        const user_id = socket.handshake.query && socket.handshake.query.user_id;
        const group_id =
          socket.handshake.query && socket.handshake.query.group_id;

        console.log(group_id, user_id);
        if (!user_id || !group_id) {
          console.log("not found");
        } else {
          socket.user_id = user_id;
          socket.group_id = group_id;
          next();
        }
      })
      .on("connection", async (socket) => {
        if (socket.group_id) {
          socket.join(socket.group_id);
        }
        this.setEventListeners(socket);
      })
      .on("error", () => {});
  }

  setEventListeners(socket) {
    socket.on("disconnect", async () => {
      if (socket.group_id) {
        socket.leave(socket.group_id);
      }
    });
  }

  emitToGroup(groupt_id, event, data) {
    this.io.to(groupt_id).emit(event, data);
  }
}

const socketSingleton = new Socket();

module.exports = socketSingleton;
