import React from "react";
import empty from "../assets/logo-xdai.svg";
import "./Loading.css";

const WrongNetworkWarning = () => (
  <div className="loading-wrapper">
    <img src={empty} alt="Empty..." className="shaking-icon" />
    <h6 className="mt-0">
      You are using the wrong network, please connect to the xDAI Network using
      Metamask. Custom RPC => https://dai.poa.network
    </h6>
  </div>
);

export default WrongNetworkWarning;
