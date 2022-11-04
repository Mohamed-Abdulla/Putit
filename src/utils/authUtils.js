import axios from "axios";
const BASE_URL = "http://localhost:5000/api/v1";
const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
export const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.access_token;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
  // withCredentials: true,
  // credentials: "include",
});
