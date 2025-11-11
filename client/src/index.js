import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

const isProduction = process.env.REACT_APP_ENV === 'production';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-kafa4sjwg3snbngt.us.auth0.com"
    clientId="3gkaRBfV7PA55yu3vxKZkRmOZGBFOnri"
    authorizationParams={{
      redirect_uri: window.location.origin,
      ...(isProduction && { audience: "https://api.neapolitandebt.com/" }),
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
