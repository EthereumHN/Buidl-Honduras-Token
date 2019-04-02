import React, { Component } from "react";
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label
} from "reactstrap";
import {
  Heading,
  Field,
  Input,
  Textarea,
  Select,
  Button,
  Card,
  Text,
  OutlineButton
} from "rimble-ui";

class MigrateToken extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0],
      receiverAddress: "",
      amount: "",
      modalSuccess: true,
      modalPending: true,
      modalBody: "",
      modalTitle: "",
      allowance: 0
    };
    this.onChangeReceiverAddress = this.onChangeReceiverAddress.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onMigrateTokens = this.onMigrateTokens.bind(this);
    this.onApprove = this.onApprove.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChangeReceiverAddress(event) {
    this.setState({ receiverAddress: event.target.value });
  }

  onChangeAmount(event) {
    this.setState({ amount: event.target.value });
  }

  componentDidMount() {
    const { drizzle } = this.props;
    this.getOldTokenBalance(drizzle);

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
              modalPending: false,
              receiverAddress: "",
              amount: ""
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
              modalSuccess: false,
              transactionId: ""
            });
          }
        }
      }
    });
  }

  async getOldTokenBalance(drizzle) {
    const allowance = await drizzle.contracts.HondurasCommunityToken.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ allowance });
  }

  async onApprove(event) {
    event.preventDefault();

    const stackId = await this.props.drizzle.contracts.HondurasCommunityToken.methods.approve.cacheSend(
      this.props.drizzle.contracts.OldTokenMigrator.address,
      this.state.allowance,
      { from: this.state.account }
    );
    this.setState({ transactionId: stackId });
  }

  async onMigrateTokens(event) {
    event.preventDefault();
    this.setState({ transactionId: stackId });
    const stackId = await this.props.drizzle.contracts.OldTokenMigrator.methods.migrateAll.cacheSend(
      this.state.account,
      { from: this.state.account }
    );
    this.setState({ transactionId: stackId });
  }

  render() {
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
        <Container className="mt-0 mb-4">
          <Row className="justify-content-center">
            <Col lg="6">
              <Heading.h2>Migrate Tokens</Heading.h2>
              <Card className="mt-4 mx-auto">
                <Form className="form">
                  <Heading.h3>
                    Old Token Balance: {this.state.allowance} HTC
                  </Heading.h3>
                  <Label>1. Approve the Migration</Label>
                  <Button fullWidth onClick={this.onApprove}>
                    Approve
                  </Button>
                  <Label className="mt-4">2. Migrate All Tokens</Label>
                  <Button fullWidth onClick={this.onMigrateTokens}>
                    Migrate
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default MigrateToken;
