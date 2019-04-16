import React, { Component } from "react";
import { Container, Col, Row, Form, FormGroup } from "reactstrap";
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

class MintTokenForm extends Component {
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
      modalTitle: ""
    };
    this.onChangeReceiverAddress = this.onChangeReceiverAddress.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
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
              modalPending: false,
              receiverAddress: "",
              amount: ""
            });
            window.toastProvider.addMessage("Minting tokens...", {
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
            window.toastProvider.addMessage("Tokens Minted", {
              secondaryMessage: `The address now has BTH`,
              variant: "success"
            });
          }
        }
      }
    });
  }

  async onSubmitForm(event) {
    event.preventDefault();
    const stackId = await this.props.drizzle.contracts.BuidlHondurasToken.methods.mint.cacheSend(
      this.state.receiverAddress,
      this.state.amount,
      { from: this.props.drizzleState.account }
    );
    this.setState({ transactionId: stackId });
  }

  render() {
    return (
      <>
        <Container className="mt-0 mb-4">
          <Row className="justify-content-center">
            <Col lg="6">
              <Heading.h2>Mint Tokens</Heading.h2>
              <Card className="mt-4 mx-auto">
                <Form className="form" onSubmit={this.onSubmitForm}>
                  <FormGroup>
                    <Field label="Receiver Address">
                      <Input
                        name="Receiver Address"
                        value={this.state.receiverAddress}
                        onChange={this.onChangeReceiverAddress}
                        required={true}
                        width={"100%"}
                      />
                    </Field>
                  </FormGroup>
                  <FormGroup>
                    <Field label="Amount">
                      <Input
                        name="Amount"
                        type="number"
                        value={this.state.amount}
                        onChange={this.onChangeAmount}
                        required={true}
                        width={"100%"}
                      />
                    </Field>
                  </FormGroup>
                  <Button type="submit">Mint Tokens</Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default MintTokenForm;
