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

class MigrateTokenAdmin extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0],
      contractAddress: this.props.drizzle.contracts.BuidlHondurasToken.address,
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
            window.toastProvider.addMessage("Begining migration...", {
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
            window.toastProvider.addMessage("Migration started", {
              secondaryMessage: `Users can migrate their old tokens now`,
              variant: "success"
            });
            this.setState({
              transactionHash: transactionHash,
              modalSuccess: false
            });
          }
        }
      }
    });
  }

  async onSubmitForm(event) {
    event.preventDefault();
    const stackId = await this.props.drizzle.contracts.OldTokenMigrator.methods.beginMigration.cacheSend(
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
        </Modal>
        <Container className="mt-0 mb-4">
          <Row className="justify-content-center">
            <Col lg="6">
              <Heading.h2>Begin Migration Tokens</Heading.h2>
              <Card className="mt-4 mx-auto">
                <Form className="form" onSubmit={this.onSubmitForm}>
                  <FormGroup>
                    <Field label="New Token Contract Address">
                      <Input
                        name="New Token Contract Address"
                        value={this.state.contractAddress}
                        onChange={this.onChangeContractAddress}
                        width={"100%"}
                        required={true}
                      />
                    </Field>
                  </FormGroup>
                  <Button type="submit">Begin Migration</Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default MigrateTokenAdmin;
