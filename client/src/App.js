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
  state = {
    messagesLoading: true,
    loading: true,
    drizzleState: null,
    wrongNetwork: false,
    noMetamask: false
  };

  componentDidMount() {
    const { drizzle } = this.props;
    // subscribe to changes in the store
    try {
      this.unsubscribe = drizzle.store.subscribe(async () => {
        // every time the store updates, grab the state from drizzle
        const drizzleState = await drizzle.store.getState();
        //    console.log(drizzleState.web3);
        if (
          drizzleState.web3.status == "initialized" &&
          drizzleState.web3.networkId != "99" &&
          !this.state.wrongNetwork
        ) {
          //    console.log(drizzleState.web3.networkId);
          if (drizzleState.web3.networkId == null) {
            this.setState({ noMetamask: true });
          } else {
            this.setState({ noMetamask: false, messagesLoading: true });
            const networkType = await drizzle.web3.eth.net.getNetworkType();
            if (networkType != "private") {
              this.setState({
                noMetamask: false,
                wrongNetwork: true
              });
            }
          }
          this.setState({ messagesLoading: false });
        }
        // check to see if it's ready, if so, update local component state
        if (drizzleState.drizzleStatus.initialized) {
          this.setState({ loading: false, drizzleState });
        }
      });
    } catch (err) {
      console.log("except");
      console.log(err);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    //If metamask is not installed or logged in

    //If wrong network
    if (this.state.wrongNetwork && !this.state.messagesLoading) {
      return (
        // Display a web3 warning.
        <WrongNetworkWarning />
      );
    }
    if (
      this.state.noMetamask &&
      !this.state.messagesLoading &&
      !this.state.wrongNetwork
    ) {
      return (
        // Display a web3 warning.
        <Web3Warning />
      );
    }

    if (this.state.loading) {
      return <Loading />;
    } else {
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
}

export default withRouter(App);
