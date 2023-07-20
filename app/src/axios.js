import axios from "axios";

const instance = axios.create({
  // baseURL: "http://192.168.1.7:4000",
  baseURL: "http://192.168.26.219:4000",
});

export default instance;
