import axiosCreate from "axios";

import config from "../config.json";

const axios = axiosCreate.create({
  baseURL: `${config.API_URL}/group`,
});

export function fetchMessages(params) {
  return axios.request({
    method: "get",
    url: `/messages`,
    headers: {
      "Content-Type": "application/json",
    },
    params,
  });
}

export function fetchMembers(params) {
  return axios.request({
    method: "get",
    url: `/members`,
    headers: {
      "Content-Type": "application/json",
    },
    params,
  });
}

export function sendMessage(data) {
  return axios.request({
    method: "post",
    url: `/send-message`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
