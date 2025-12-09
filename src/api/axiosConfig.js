import axios from "axios";

const api = axios.create({
  baseURL: "https://servidor-proyecto-final-itla.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
