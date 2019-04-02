import React, { Component } from "react";
import MigrateToken from "./MigrateToken";

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
