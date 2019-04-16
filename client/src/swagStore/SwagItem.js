import React, { Component } from "react";
import { Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Card, Box, Flex, Image, Heading, TextButton, Button } from "rimble-ui";
import "./SwagItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

class SwagItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      status: "initialized",
      modalSuccess: true,
      modalPending: true
    };
    this.onButtonClick = this.onButtonClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    this.getSwagData();
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        if (drizzleState.transactionStack[this.state.transactionId]) {
          const transactionHash =
            drizzleState.transactionStack[this.state.transactionId];
          if (
            drizzleState.transactions[transactionHash].status == "pending" &&
            this.state.modalPending
          ) {
            this.setState({
              transactionHash: transactionHash,
              modalPending: false
            });
            window.toastProvider.addMessage("Buying Swag token...", {
              secondaryMessage: "Check progress on Blockscout",
              actionHref: `https://blockscout.com/poa/dai/blocks/${transactionHash}/transactions`,
              actionText: "Check",
              variant: "processing"
            });
          }
          if (
            drizzleState.transactions[transactionHash].status == "success" &&
            this.state.modalSuccess
          ) {
            this.setState({
              transactionHash: transactionHash,
              modalSuccess: false
            });
            window.toastProvider.addMessage("Swag Token Bought!", {
              secondaryMessage: `You are the owner of this token`,
              variant: "success"
            });
          }
        }
      }
    });
  }

  async getSwagData() {
    let token = await this.props.drizzle.contracts.SwagNFT.methods
      .tokenURI(this.props.tokenId)
      .call();
    this.setState({ token: JSON.parse(token), status: "complete" });
  }

  async onButtonClick() {
    const stackId = await this.props.drizzle.contracts.BuidlHondurasToken.methods.transferAndCall.cacheSend(
      this.props.drizzle.contracts.SwagStore.address,
      this.state.token.price,
      this.props.tokenId,
      { from: this.props.account }
    );
    this.setState({ transactionId: stackId });
  }

  render() {
    if (this.state.token == null) {
      switch (this.state.status) {
        case "complete":
          return <p>error...</p>;
        default:
          return <p>Loading...</p>;
      }
    }
    let { token } = this.state;
    return (
      <>
        <Col lg="4" className="mb-4">
          <Card
            className="card-container"
            width={"300px"}
            mx={"auto"}
            my={0}
            p={0}
          >
            <Image
              width={1}
              src={token.imageUrl}
              alt={token.name}
              className="px-4 pt-4 tokenImage"
            />
            <Box px={4} py={3}>
              <Heading.h3>{token.name}</Heading.h3>
              <Heading.h5 color="#666">{token.description}</Heading.h5>
              <TextButton p={"0"} mr={4} height={"auto"}>
                Price: {token.price} BHT
              </TextButton>
            </Box>

            <Flex height={3}>
              <Button
                size="large"
                fullWidth
                className="bottom"
                onClick={this.onButtonClick}
              >
                <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
                Get Swag
              </Button>
            </Flex>
          </Card>
        </Col>
      </>
    );
  }
}

export default SwagItem;
