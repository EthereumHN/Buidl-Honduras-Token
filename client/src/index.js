import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Drizzle, generateStore } from "drizzle";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import HondurascommunityToken from "./contracts/HondurasCommunityToken.json";
import SwagNFT from "./contracts/SwagNFT.json";
import SwagStore from "./contracts/SwagStore.json";

const options = {
  contracts: [HondurascommunityToken, SwagNFT, SwagStore]
};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
  <Router>
    <App drizzle={drizzle} />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
