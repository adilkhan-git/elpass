import { http } from "boot/axios";

const api = {
  login(email, password) {
    return http.post("/login", { email, password });
  },
};

export { api };
