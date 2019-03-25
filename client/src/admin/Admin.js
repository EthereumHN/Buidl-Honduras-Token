import React, { Component } from "react";
import SwagForm from "./SwagForm";
import MintTokenForm from "./MintTokenForm";
import SetNFTAddress from "./SetNFTAddress";

class Admin extends Component {
  render() {
    return (
      <>
        <SwagForm
          drizzleState={this.props.drizzleState}
          drizzle={this.props.drizzle}
        />
        <MintTokenForm
          drizzleState={this.props.drizzleState}
          drizzle={this.props.drizzle}
        />
        <SetNFTAddress
          drizzleState={this.props.drizzleState}
          drizzle={this.props.drizzle}
        />
      </>
    );
  }
}

export default Admin;
