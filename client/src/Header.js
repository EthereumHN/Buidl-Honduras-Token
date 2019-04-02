import React, { Component } from "react";
import { Nav, NavItem } from "reactstrap";
import Blockies from "react-blockies";
import { Link, Icon } from "rimble-ui";

class Header extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0],
      hasBalance: false,
      balance: 0
    };
  }

  componentDidMount() {
    const { drizzle } = this.props;
    this.checkOwner(drizzle);
    this.hasBalance(drizzle);
  }

  async checkOwner(drizzle) {
    const isMinter = await drizzle.contracts.BuidlHondurasToken.methods
      .isMinter(this.state.account)
      .call();
    console.log(isMinter);
    this.setState({ isMinter });
  }

  async hasBalance(drizzle) {
    var balance = await drizzle.contracts.BuidlHondurasToken.methods
      .balanceOf(this.state.account)
      .call();
    balance = balance;
    var hasBalance = balance > 0 ? true : false;
    this.setState({ hasBalance, balance });
  }

  render() {
    return (
      <Nav className="mt-4 justify-content-end">
        <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
          <Link href="/">
            <span>
              <Icon name="Redeem" size="20" className="mr-1" />
              Swag
            </span>
          </Link>
        </NavItem>
        <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
          <Link href="#">
            <Icon name="AccountBalanceWallet" size="20" className="mr-1" />
            Balance: {this.state.balance} BHT
          </Link>
        </NavItem>
        <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
          <Link href="/settings">
            <Icon name="Settings" size="20" className="mr-1" />
            Settings
          </Link>
        </NavItem>
        {this.state.isMinter && (
          <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
            <Link href="/admin">
              <Icon name="SettingsApplications" size="20" className="mr-1" />
              Admin
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

export default Header;
