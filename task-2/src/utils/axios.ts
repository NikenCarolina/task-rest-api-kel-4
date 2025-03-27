import axios from "axios";
import constants from "../constants";

const axiosInstance = axios.create({
  baseURL: constants.Api,
});

export default axiosInstance;
