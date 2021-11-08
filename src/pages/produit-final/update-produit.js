import React, { useState, useEffect, useRef, useContext } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import ErrorModel from "../../models/error-models";
import SuccessModel from "../../models/success-models";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Authcontext } from "../../context/auth-context";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const UpdateProduit = (props) => {
  const classes = useStyles();

  const [File, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!File) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };

    fileReader.readAsDataURL(File);
  }, [File]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    /* props.onInput(props.id, pickedFile, fileIsValid); */
  };

  const pickImageHandler = (event) => {
    filePickerRef.current.click();
  };

  const [nom, setNom] = useState();
  const [region, setRegion] = useState();
  const [prix, setPrix] = useState();
  const [quantite, setQuantite] = useState();
  const [description, setDescription] = useState();
  const [error, seterror] = useState(false);
  const [success, setsuccess] = useState(false);

  const onchange = (e) => {
    if (e.target.name === "nom") {
      setNom(e.target.value);
    } else if (e.target.name === "region") {
      setRegion(e.target.value);
    } else if (e.target.name === "prix") {
      setPrix(e.target.value);
    } else if (e.target.name === "quantite") {
      setQuantite(e.target.value);
    } else if (e.target.name === "description") {
      setDescription(e.target.value);
    }
  };

  const auth = useContext(Authcontext);
  const id = useParams().id;

  const submit = async (e) => {
    e.preventDefault();
    if (File != null) {
      try {
        const formData = new FormData();

        formData.append("image", File);
        formData.append("nom", nom);
        formData.append("region", region);
        formData.append("prix", prix);
        formData.append("quantite", quantite);
        formData.append("description", description);
        formData.append("IdUser", auth.user._id);

        await axios.patch(
          `http://localhost:5000/api/produitfinal/${id}`,
          formData
        );

        setsuccess("Produit modifié avec succée");
        seterror(null);
      } catch (err) {
        seterror(err.message || "il y a un probleme");
        setsuccess(null);
      }
    } else {
      seterror("Veuiller sélectionner une image");
    }
  };
  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/produitfinal/${id}`
        );

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setNom(responseData.produit.nom);
        setPrix(responseData.produit.prix);
        setRegion(responseData.produit.region);
        setDescription(responseData.produit.description);
        setQuantite(responseData.produit.quantite);
        setPreviewUrl("http://localhost:5000/" + responseData.produit.image);

        console.log(responseData.produit);
      } catch (err) {
        seterror(err.message);
      }
    };

    sendRequest();
  }, []);

  return (
    <div>
      <Container>
        <Row>
          <Col></Col>
          <Col xs={10}>
            <ErrorModel error={error} />
            <SuccessModel success={success} />
            <Form onSubmit={submit}>
              <div
                style={{
                  width: "50%",
                  marginBottom: "30px",
                  marginTop: "20px",
                }}
              >
                <input
                  ref={filePickerRef}
                  style={{ display: "none" }}
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  onChange={pickedHandler}
                />
                <div>
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      rounded
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}

                  <Button
                    type="button"
                    variant="primary"
                    onClick={pickImageHandler}
                    style={{ marginTop: "20px" }}
                  >
                    Choisir une image
                  </Button>
                </div>
                {!isValid && <p></p>}
              </div>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    value={nom}
                    placeholder="Nom"
                    name="nom"
                    onChange={onchange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Region</Form.Label>
                  <Form.Control
                    value={region}
                    placeholder="Region"
                    name="region"
                    onChange={onchange}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group controlId="formGridEmail">
                <Form.Label>Prix</Form.Label>
                <Form.Control
                  value={prix}
                  placeholder="Prix"
                  name="prix"
                  type="number"
                  onChange={onchange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formGridEmail">
                <Form.Label>Quantité</Form.Label>
                <Form.Control
                  value={quantite}
                  placeholder="Quantite"
                  name="quantite"
                  type="number"
                  onChange={onchange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  value={description}
                  as="textarea"
                  rows={5}
                  name="description"
                  onChange={onchange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Modifier
              </Button>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
};
export default UpdateProduit;
