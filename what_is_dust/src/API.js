import axios from "axios";

export default axios.create({
  baseURL: "http://oss.khunet.net:4000",
  responseType: "json",
});
