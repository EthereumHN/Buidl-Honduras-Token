import React, { Component } from "react";
import SwagForm from "./SwagForm";
import MintTokenForm from "./MintTokenForm";
import SetNFTAddress from "./SetNFTAddress";
import MigrateTokenAdmin from "./MigrateTokenAdmin";
import AddMinter from "./AddMinter";

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
        <AddMinter
          drizzleState={this.props.drizzleState}
          drizzle={this.props.drizzle}
        />
        <SetNFTAddress
          drizzleState={this.props.drizzleState}
          drizzle={this.props.drizzle}
        />
        <MigrateTokenAdmin
          drizzleState={this.props.drizzleState}
          drizzle={this.props.drizzle}
        />
      </>
    );
  }
}

export default Admin;
