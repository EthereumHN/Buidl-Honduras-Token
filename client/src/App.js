import React, { Component } from "react";
import Header from "./Header";
import "./App.css";
import { ThemeProvider } from "rimble-ui";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import Admin from "./admin/Admin";
import SwagList from "./swagStore/SwagList";
import Settings from "./swagStore/Settings";
import { ToastMessage } from "rimble-ui";
import WrongNetworkWarning from "./messages/WrongNetworkWarning";
import Web3Warning from "./messages/Web3Warning";
import Loading from "./messages/Loading";
import web3 from "web3";

class App extends Component {
  state = { loading: true, drizzleState: null };

  componentDidMount() {
    const { drizzle } = this.props;
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(async () => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      if (
        drizzleState.web3.networkId != null &&
        drizzleState.web3.networkId != "99"
      ) {
        const networkType = await drizzle.web3.eth.net.getNetworkType();
        if (networkType != "private") {
          this.setState({ wrongNetwork: true });
        }
      }
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    //If metamask is not installed or logged in
    if (
      web3.status === "failed" ||
      (!this.state.loading && this.state.drizzleState.accounts[0] == undefined)
    ) {
      return (
        // Display a web3 warning.
        <Web3Warning />
      );
    }
    //If wrong network
    if (this.state.wrongNetwork) {
      return (
        // Display a web3 warning.
        <WrongNetworkWarning />
      );
    }

    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <ThemeProvider>
        <Header
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />
        <Route
          exact
          path="/settings"
          render={() => (
            <Settings
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
          )}
        />
        <Route
          exact
          path="/admin"
          render={() => (
            <Admin
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
          )}
        />
        <Route
          exact
          path="/"
          render={() => (
            <SwagList
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
          )}
        />
        <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
      </ThemeProvider>
    );
  }
}

export default withRouter(App);
