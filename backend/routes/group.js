const { default: axios } = require("axios");
const express = require("express");
const { user, group, groupMessage, groupMembers } = require("../models");
const { socketEmit } = require("../utils/socket");

const router = express.Router();

// Send message
router.post("/group/send-message", async (req, res) => {
  try {
    const { user_id, group_id, message, messagesContext, triggerBot } =
      req.body;
    let userEntry = await user.findById(user_id);
    if (!userEntry) throw new Error("User not found");
    let groupEntry = await group.findById(group_id);
    if (!groupEntry) throw new Error("Group not found");

    const newMessage = new groupMessage({
      message,
      user_id,
      group_id,
      type: "message",
      sender: "user",
    });

    await newMessage.save();

    console.log("newMessage", newMessage);
    const emitData = {
      _id: newMessage._id,
      group_id,
      type: "message",
      sender: "user",
      message: newMessage.message,
      timestamp: newMessage.timestamp,
      user_id: {
        _id: user_id,
        userName: userEntry.userName,
      },
    };

    await socketEmit({
      group_id: groupEntry._id,
      event: "new_message",
      data: emitData,
    });

    if (triggerBot) {
      try {
        const result = await axios.post(
          `https://eagerly-natural-ox.ngrok-free.app/process`,
          {
            message_history: messagesContext,
          }
        );
        if (result?.data?.message) {
          const aiResponseMessage = new groupMessage({
            message: result.data.message,
            group_id,
            type: "message",
            sender: "system",
          });

          await aiResponseMessage.save();
          const aiResponseemitData = {
            _id: aiResponseMessage._id,
            group_id,
            type: "message",
            sender: "system",
            message: aiResponseMessage.message,
            timestamp: aiResponseMessage.timestamp,
          };

          await socketEmit({
            group_id: groupEntry._id,
            event: "new_message",
            data: aiResponseemitData,
          });
        }
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }

    // send message to socket

    // send user_id, group_id, message, unique_message_id to ai service, userEntry.userName

    res.status(200).send({ status: "OKAY" });
  } catch (error) {
    console.error("error while sending message", error);
    res.status(400).send(error);
  }
});

// receive ai response
router.post("/group/ai-response", async (req, res) => {
  try {
    const { user_id, group_id, message, unique_message_id } = req.body;
    let userEntry = await user.findById(user_id);
    if (!userEntry) throw new Error("User not found");
    let groupEntry = await group.findById(group_id);
    if (!groupEntry) throw new Error("Group not found");

    const newMessage = new groupMessage({
      message,
      user_id,
      group_id,
      type: "message",
      sender: "system",
    });

    await newMessage.save();

    res.status(200).send({ group: groupEntry });
  } catch (error) {
    console.error("error while receiving message from ai service", error);
    res.status(400).send(error);
  }
});

// get messages
router.get("/group/messages", async (req, res) => {
  try {
    let { user_id, group_id, page = 1, limit = 10 } = req.query;
    let userEntry = await user.findById(user_id);
    if (!userEntry) throw new Error("User not found");
    let groupEntry = await group.findById(group_id);
    if (!groupEntry) throw new Error("Group not found");

    page = Number(page);
    limit = Number(limit);
    console.log("here?");
    const messages = await groupMessage
      .find({ group_id })
      .populate("user_id", "userName")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ timestamp: -1 });

    console.log("messages", messages);

    res.status(200).send({ messages });
  } catch (error) {
    console.error("error while fetching messages", error);
    res.status(400).send(error);
  }
});

// get members
router.get("/group/members", async (req, res) => {
  try {
    const { user_id, group_id } = req.query;
    let userEntry = await user.findById(user_id);
    if (!userEntry) throw new Error("User not found");
    let groupEntry = await group.findById(group_id);
    if (!groupEntry) throw new Error("Group not found");

    console.log("here?");
    const members = await groupMembers
      .find({ group_id })
      .populate("user_id", "userName");

    console.log("members", members);

    res.status(200).send({
      members: members.map((item) => {
        return {
          user_id: item.user_id._id,
          userName: item.user_id.userName,
          joinedOn: item.joinedOn,
        };
      }),
    });
  } catch (error) {
    console.error("error while fetching messages", error);
    res.status(400).send(error);
  }
});

// app.post("/stream", (req, res) => {
//   req.setEncoding("utf8"); // Ensure the incoming data is interpreted as UTF-8 strings

//   req.on("data", (chunk) => {
//     console.log("Received chunk:", chunk);
//     // Process the chunk here (e.g., write it to a file or a database)
//   });

//   req.on("end", () => {
//     console.log("Stream ended");
//     res.status(200).send("Stream received");
//   });

//   req.on("error", (err) => {
//     console.error("Stream error:", err);
//     res.status(500).send("Stream error");
//   });
// });

module.exports = router;
