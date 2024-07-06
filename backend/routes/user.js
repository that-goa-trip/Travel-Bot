const express = require("express");
const { user, group, groupMessage, groupMembers } = require("../models");
const { socketEmit } = require("../utils/socket");

const router = express.Router();

// User join
router.post("/user/join", async (req, res) => {
  try {
    const { userName, groupName } = req.body;
    const joiningMessage = `Welcome to the chat ${userName} 👋`;
    let userEntry = await user.findOne({ userName });
    if (!userEntry) {
      userEntry = new user({ userName });
      await userEntry.save();
    }
    let groupEntry = await group.findOne({ name: groupName });
    if (!groupEntry) {
      groupEntry = new group({ name: groupName });
      await groupEntry.save();
    }

    // track of all the members
    try {
      const newMember = new groupMembers({
        user_id: userEntry._id,
        group_id: groupEntry._id,
      });
      await newMember.save();
      console.log(newMember);
      const emitData = {
        user_id: userEntry._id,
        userName: userEntry.userName,
        joinedOn: newMember.joinedOn,
      };
    } catch (error) {
      console.log("Member not created", error);
    }

    console.log({ group: groupEntry, user: userEntry });

    res.status(201).send({ group: groupEntry, user: userEntry });
  } catch (error) {
    console.error("error in joining", error);
    res.status(400).send(error);
  }
});

module.exports = router;
