import React, { Component } from "react";
import { Nav, NavItem } from "reactstrap";
import { Link, Icon } from "rimble-ui";

class SwagList extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0]
    };
  }

  componentDidMount() {
    const { drizzle } = this.props;
    this.getSwag(drizzle);
  }

  async getSwag(drizzle) {
    const swagList = await drizzle.contracts.SwagNFT.methods.getSwag().call();
    //Save list in state
  }

  render() {
    return (
      <Nav className="mt-4 justify-content-end">
        <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
          <Link href="/">
            <span>
              <Icon name="Home" size="20" className="mr-1" />
              Home
            </span>
          </Link>
        </NavItem>
        <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
          <Link href="#">
            <Icon name="AccountBalanceWallet" size="20" className="mr-1" />
            Balance: {this.state.balance} HCT
          </Link>
        </NavItem>

        {this.state.isOwner && (
          <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
            <Link href="/admin">
              <Icon name="Settings" size="20" className="mr-1" />
              Admin Settings
            </Link>
          </NavItem>
        )}
        <NavItem className="ml-2 mt-1 text-right ">
          <b>Current Account:</b> <br />
          <label>{this.state.account}</label>
        </NavItem>

        <NavItem className="ml-2 mr-4">
          <Blockies seed={this.state.account} size={10} scale={5} />
        </NavItem>
      </Nav>
    );
  }
}

export default SwagList;
