import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import App from "./App";
import { ApolloProvider } from "react-apollo";
import client from "./apiClient";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  rootElement
);
