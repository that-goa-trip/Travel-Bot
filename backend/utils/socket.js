const axios = require("axios");
const config = require("../config.json");

exports.socketEmit = async ({ group_id, event, data }) => {
  if (!group_id || !event || !data)
    return Promise.reject("Missing parameters in socketEmit()");

  try {
    const result = await axios.post(`${config.socket_url}/emit-to-group`, {
      group_id,
      event,
      data,
    });

    return result.data;
  } catch (err) {
    console.error("Could not emit event", err);
  }
};
