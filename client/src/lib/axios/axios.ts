import axios from "axios";

import { SLICE_NAMES } from "../../constants/enums";

const axios_instance = axios.create({
  baseURL: `${import.meta.env.VITE_DEPLOYED_BACKEND_HOSTNAME}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

const axios_instanceFormData = axios.create({
  baseURL: `${import.meta.env.VITE_DEPLOYED_BACKEND_HOSTNAME}/v1`,
});

axios_instance.interceptors.request.use(
  (config) => {
    const localUser = localStorage.getItem(SLICE_NAMES.USER);
    if (localUser == "undefined") {
      localStorage.removeItem(SLICE_NAMES.USER);
    }
    let token;
    if (!localUser || localUser == "undefined") {
      token = null;
    } else {
      token = JSON.parse(localUser)?.token;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios_instanceFormData.interceptors.request.use(
  (config) => {
    const localUser = localStorage.getItem(SLICE_NAMES.USER);
    if (localUser == "undefined") {
      localStorage.removeItem(SLICE_NAMES.USER);
    }
    let token;
    if (!localUser || localUser == "undefined") {
      token = null;
    } else {
      token = JSON.parse(localUser)?.token;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axios_instance, axios_instanceFormData };
