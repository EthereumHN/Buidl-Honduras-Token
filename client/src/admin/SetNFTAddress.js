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
  ModalFooter
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

class SetNFTAddress extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      contractAddress: drizzle.contracts.SwagNFT.address,
      modalSuccess: true,
      modalPending: true,
      modalBody: "",
      modalTitle: ""
    };
    this.onChangeContractAddress = this.onChangeContractAddress.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChangeContractAddress(event) {
    this.setState({ contractAddress: event.target.value });
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

  async onSubmitForm(event) {
    event.preventDefault();
    const stackId = await this.props.drizzle.contracts.SwagStore.methods.setNFTAddress.cacheSend(
      this.state.contractAddress,
      { from: this.props.drizzleState.account }
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
        </Modal>{" "}
        <Container className="mt-0 mb-4">
          <Row className="justify-content-center">
            <Col lg="6">
              <Heading.h2>Set Swag NFT Address</Heading.h2>
              <Card className="mt-4 mx-auto">
                <Form className="form" onSubmit={this.onSubmitForm}>
                  <FormGroup>
                    <Field label="Receiver Address">
                      <Input
                        name="Receiver Address"
                        value={this.state.contractAddress}
                        onChange={this.onChangeContractAddress}
                        fullWidth
                      />
                    </Field>
                  </FormGroup>

                  <Button type="submit">Set Address</Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default SetNFTAddress;
