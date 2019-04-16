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
              modalPending: false,
              name: "",
              description: "",
              image: "",
              price: "",
              fileText: "Select Swag Image",
              captureFile: ""
            });
            window.toastProvider.addMessage("Creating Swag token...", {
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
            window.toastProvider.addMessage("Swag Token Minted", {
              secondaryMessage: `Users can now buy this token`,
              variant: "success"
            });
          }
        }
      }
    });
  }

  async onSubmitForm(event) {
    event.preventDefault();
    window.toastProvider.addMessage("Upload in progress...", {
      secondaryMessage: "Please wait",
      variant: "processing"
    });
    await ipfs.add(this.state.buffer, async (err, ipfsHash) => {
      window.toastProvider.addMessage("Image uploaded!", {
        icon: "Image"
      });
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
                        required={true}
                        width={"100%"}
                      />
                    </Field>
                  </FormGroup>
                  <FormGroup>
                    <Field label="Description">
                      <Textarea
                        name="Description"
                        value={this.state.description}
                        onChange={this.onChangeDescription}
                        required={true}
                        width={"100%"}
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
                        required={true}
                        width={"100%"}
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
                        required={true}
                        width={"100%"}
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
