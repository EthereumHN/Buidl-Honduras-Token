import React from "react";
import metamask from "../assets/metamask.png";
import "./Loading.css";

const Web3Warning = () => (
  <div className="loading-wrapper">
    <a href="metamask.io">
      <img src={metamask} alt="Empty..." className="shaking-icon" />
      <h6 className="mt-0">
        This browser has no connection to the Ethereum network. Please use the
        Chrome/FireFox extension MetaMask, Nifty Wallet, or dedicated Ethereum
        browsers.
        <a href="https://metamask.io/" target="blank">
          Click here to download Metamask.
        </a>
      </h6>
    </a>
  </div>
);

export default Web3Warning;
