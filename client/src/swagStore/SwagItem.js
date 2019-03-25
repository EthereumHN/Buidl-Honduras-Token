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
      modalPending: true,
      modalBody: "",
      modalTitle: ""
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
              modal: true,
              modalTitle: "Transaction Submited!",
              modalBody: "Wait for confirmation",
              modalPending: false
            });
          }
          if (
            drizzleState.transactions[transactionHash].status == "success" &&
            this.state.modalSuccess
          ) {
            this.setState({
              transactionHash: transactionHash,
              modal: true,
              modalTitle: "Success!",
              modalBody: `The information was saved in the blockchain with the confirmation hash: ${
                this.state.transactionHash
              }`,
              modalSuccess: false
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
    console.log(this.props.drizzle);
    console.log(this.state.token.price);
    console.log(this.props.tokenId);

    const stackId = await this.props.drizzle.contracts.HondurasCommunityToken.methods.transferAndCall.cacheSend(
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
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          size="lg"
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            {this.state.modalTitle}
          </ModalHeader>
          <ModalBody>{this.state.modalBody}</ModalBody>
          <ModalFooter>
            <Button onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
        <Col lg="4">
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
                Price: {token.price} HCT
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
