const mongoose = require("mongoose");

const groupMembers = new mongoose.Schema({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  joinedOn: { type: Date, default: Date.now },
});

groupMembers.index({ group_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model("groupMembers", groupMembers);
