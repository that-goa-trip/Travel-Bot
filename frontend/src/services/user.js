import axiosCreate from "axios";

import config from "../config.json";

const axios = axiosCreate.create({
  baseURL: `${config.API_URL}/user`,
});

export function joinGroup(data) {
  return axios.request({
    method: "post",
    url: `/join`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
