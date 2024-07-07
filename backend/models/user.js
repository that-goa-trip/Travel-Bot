const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model("user", schema);

module.exports = User;
