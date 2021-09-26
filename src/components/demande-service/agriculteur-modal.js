import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const AgriculteurModal = (props) => {
  const [list, setList] = useState();
  const [error, seterror] = useState(null);
  const [success, setsuccess] = useState(null);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/agriculteur/${props.id}`
        );

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setList(responseData.agriculteur);
      } catch (err) {
        seterror(err.message);
      }
    };

    sendRequest();
  }, [props.id]);
  console.log(props.id)

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {list && list.nom + " " + list.prenom}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Adresse: {list && list.adresse}</h5>
        <p>
          Téléphone: {list && list.tel}
          <br></br>
          Email: {list && list.email}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgriculteurModal;
