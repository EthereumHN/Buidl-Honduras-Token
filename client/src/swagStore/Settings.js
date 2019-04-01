import React, { Component } from "react";
import SwagForm from "./MigrateToken";

class Settings extends Component {
  render() {
    return (
      <>
        <MigrateToken
          drizzleState={this.props.drizzleState}
          drizzle={this.props.drizzle}
        />
      </>
    );
  }
}

export default Settings;
