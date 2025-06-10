import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { DataProvider } from "./contexts/DataContextProvider";
import "./index.css";

axios.defaults.baseURL = "http://localhost:8081/api";
// set default fallback methode when unauthorized
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      console.log("interceptor starting");
      // send refresh token to server
      const refreshToken = localStorage.getItem("refreshToken");
      axios
        .post("/login/token", { refreshToken })
        .then((res) => {
          // set token, refresh token and username in local storage
          localStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);

          // set token in axios header
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.accessToken;
          // retry request
          return axios(err.config);
        })
        .catch((err) => {
          // redirect to login page
          if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/register"
          ) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");

            window.location.href = "/login?error=Login%20expired";
          }
        });
    }
    return Promise.reject(err);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <DataProvider>
        <App />
      </DataProvider>
    </Router>
  </React.StrictMode>
);
