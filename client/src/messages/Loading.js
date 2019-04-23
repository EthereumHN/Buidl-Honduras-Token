import React from "react";
import loading from "../assets/token-logo.png";
import "./Loading.css";

const Loading = () => (
  <div className="loading-wrapper">
    <img src={loading} alt="loading..." className="breathing-icon" />
    <h4 className="mt-0">Loading Store...</h4>
  </div>
);

export default Loading;
