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
import ipfs from "../scripts/ipfs";

class SwagForm extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0],
      name: "",
      description: "",
      price: "",
      image: "",
      fileText: "Select Swag Image",
      modalSuccess: true,
      modalPending: true,
      modalBody: "",
      modalTitle: ""
    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onChangeName(event) {
    this.setState({ name: event.target.value });
  }

  onChangeDescription(event) {
    this.setState({ description: event.target.value });
  }

  onChangePrice(event) {
    this.setState({ price: event.target.value });
  }

  onChangeImage(event) {
    this.setState({ image: event.target.value });
  }

  //Take file input from user
  //TODO: restrict only images
  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    var fileText = "Select Profile Image";
    if (event.target.files[0] != null) {
      fileText = event.target.files[0].name;
    }
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader, fileText);
  };

  //Convert the file to buffer to store on IPFS
  convertToBuffer = async (reader, fileText) => {
    //file is converted to a buffer for upload to IPFS
    this.setState({ fileText });
    const buffer = await Buffer.from(reader.result);
    //set this buffer-using es6 syntax
    this.setState({ buffer });
  };

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
              modalPending: false,
              name: "",
              description: "",
              image: "",
              price: "",
              fileText: "Select Swag Image",
              captureFile: ""
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
    await ipfs.add(this.state.buffer, async (err, ipfsHash) => {
      this.setState({ image: ipfsHash[0].hash });
      const tokenUri = {
        name: this.state.name,
        description: this.state.description,
        price: this.state.price,
        imageUrl: `https://gateway.ipfs.io/ipfs/${ipfsHash[0].hash}`,
        imageHash: ipfsHash[0].hash
      };
      const stackId = await this.props.drizzle.contracts.SwagNFT.methods.createSwag.cacheSend(
        JSON.stringify(tokenUri),
        this.state.price,
        { from: this.props.drizzleState.account }
      );
      this.setState({ transactionId: stackId });
    });
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
        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col lg="6">
              <Heading.h2>Add Swag</Heading.h2>
              <Card className="mt-4 mx-auto">
                <Form className="form" onSubmit={this.onSubmitForm}>
                  <FormGroup>
                    <Field label="Name">
                      <Input
                        name="Name"
                        value={this.state.name}
                        onChange={this.onChangeName}
                        fullWidth
                      />
                    </Field>
                  </FormGroup>
                  <FormGroup>
                    <Field label="Description">
                      <Textarea
                        name="Description"
                        value={this.state.description}
                        onChange={this.onChangeDescription}
                        fullWidth
                      />
                    </Field>
                  </FormGroup>
                  <FormGroup>
                    <Field label="Price">
                      <Input
                        name="Price"
                        type="number"
                        value={this.state.price}
                        onChange={this.onChangePrice}
                        fullWidth
                      />
                    </Field>
                  </FormGroup>
                  <FormGroup>
                    <Field label="Image">
                      <Input
                        type="file"
                        className="x-file-input"
                        onChange={this.captureFile}
                        id="customFile"
                      />
                      <label className="x-file-label" htmlFor="customFile">
                        {this.state.fileText}
                      </label>
                    </Field>
                  </FormGroup>
                  <Button type="submit">Add Swag</Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default SwagForm;
