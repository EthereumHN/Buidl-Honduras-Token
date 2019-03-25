import React, { Component } from "react";
import { Container, Col, Row } from "reactstrap";
import { Heading } from "rimble-ui";
import SwagItem from "./SwagItem";

class SwagList extends Component {
  constructor(props) {
    super(props);
    const { drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0],
      tokens: null,
      status: "initialized"
    };
  }

  componentDidMount() {
    const { drizzle } = this.props;
    this.getSwag(drizzle);
  }

  async getSwag(drizzle) {
    const swagList = await drizzle.contracts.SwagNFT.methods
      .tokensOfOwner(drizzle.contracts.SwagStore.address)
      .call();
    this.setState({ tokens: swagList, status: "complete" });
    //Save list in state
  }

  render() {
    if (this.state.tokens == null) {
      switch (this.state.status) {
        case "complete":
          return <p>Empty...</p>;
        default:
          return <p>Loading...</p>;
      }
    }
    let tokens = this.state.tokens;
    return (
      <>
        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col lg="12">
              <Heading.h2>All Items</Heading.h2>
              <Row className="justify-content-center mt-0">
                {tokens.map(token => (
                  <SwagItem
                    key={token}
                    tokenId={token}
                    drizzle={this.props.drizzle}
                    account={this.state.account}
                  />
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default SwagList;
