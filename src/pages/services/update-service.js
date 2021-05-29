import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ErrorModel from "../../models/error-models";
import SuccessModel from "../../models/success-models";
import {useParams} from 'react-router-dom'

const UpdateService = (props) => {
  const [nom, setNom] = useState();
  const [type, setType] = useState();
  const [prix, setPrix] = useState();
  const [description, setDescription] = useState();
  const [error, seterror] = useState(null);
  const [success, setsuccess] = useState(null);

  const onchange = (e) => {
    if (e.target.name === "nom") {
      setNom(e.target.value);
    } else if (e.target.name === "type") {
      setType(e.target.value);
    } else if (e.target.name === "prix") {
      setPrix(e.target.value);
    } else if (e.target.name === "description") {
      setDescription(e.target.value);
    }
  };
 
  const id = useParams().id
  const submit = async (e) => {
    e.preventDefault();

    try {
      let response = await fetch(`http://localhost:5000/api/service/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: nom,
          type: type,
          prix: prix,
          description: description,
        }),
      });
      let responsedata = await response.json();
      if (!response.ok) {
        seterror(responsedata.message);
        throw new Error(responsedata.message);
      }
      setsuccess("Le service est modifié.");
    } catch (err) {
      console.log(err);
      seterror(err.message || "probleme!!");
    }
  };

  return (
    <div>
      <Container>
        <Row>
          <Col></Col>
          <Col xs={9}>
            <ErrorModel error={error} />
            <SuccessModel success={success} />
            <Form onSubmit={submit}>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    placeholder="nom"
                    name="nom"
                    onChange={onchange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue="Choose..."
                    name="type"
                    onChange={onchange}
                    required
                  >
                    <option>Choose...</option>
                    <option>...</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>

              <Form.Group controlId="formGridAddress1">
                <Form.Label>Prix</Form.Label>
                <Form.Control
                  placeholder="prix"
                  type="number"
                  name="prix"
                  onChange={onchange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  onChange={onchange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Ajouter
              </Button>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
};

export default UpdateService;
