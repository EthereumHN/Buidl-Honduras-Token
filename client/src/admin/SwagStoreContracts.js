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
  OutlineButton,
  PublicAddress
} from "rimble-ui";

class SwagStoreContracts extends Component {
  render() {
    const { drizzle } = this.props;
    return (
      <>
        <Container className="mt-0 mb-4">
          <Row className="justify-content-center">
            <Col lg="6">
              <Heading.h2>Contract Addresses</Heading.h2>
              <Card className="mt-4 mx-auto">
                <Form className="form" onSubmit={this.onSubmitForm}>
                  <FormGroup>
                    <Field label="BHT" className="publicAddress">
                      <PublicAddress className="publicAddress"
                        address={drizzle.contracts.BuidlHondurasToken.address}
                        fullWidth
                      />
                    </Field>
                  </FormGroup>
                  <FormGroup>
                    <Field label="Token Migrator" className="publicAddress">
                      <PublicAddress className="publicAddress"
                        address={drizzle.contracts.OldTokenMigrator.address}
                        fullWidth
                      />
                    </Field>
                  </FormGroup>
                  <FormGroup>
                    <Field label="Swag Store" className="publicAddress">
                      <PublicAddress label="Swag Store" 
                        address={drizzle.contracts.SwagStore.address}
                        fullWidth
                      />
                    </Field>
                  </FormGroup>
                  <FormGroup>
                    <Field label="Swag NFT" className="publicAddress">
                      <PublicAddress className="publicAddress"
                        address={drizzle.contracts.SwagNFT.address}
                        fullWidth
                      />
                    </Field>
                  </FormGroup>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default SwagStoreContracts;
