import React, { useState, useEffect, useContext } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Container, Row, Col } from "react-bootstrap";
import UpdateIcon from "@material-ui/icons/Update";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import TablePagination from "@material-ui/core/TablePagination";
import ErrorModel from "../../models/error-models";
import SuccessModel from "../../models/success-models";
import { Link } from "react-router-dom";
import AjoutBTN from "../../components/btnAjout";
import { Authcontext } from "../../context/auth-context";
import { Image, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function DetailCommande() {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [list, setList] = useState();
  const [commande, setCommande] = useState();
  const [error, seterror] = useState(null);
  const [success, setsuccess] = useState(null);

  const auth = useContext(Authcontext);
  const id = useParams().id;

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/commande/${id}`
        );

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setCommande(responseData.Commande);
      } catch (err) {
        seterror(err.message);
      }
    };

    sendRequest();

    const sendRequest2 = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/produitfinal/commande/${id}`
        );

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setList(responseData.existingProduit);
      } catch (err) {
        seterror(err.message);
      }
    };

    sendRequest2();
  }, []);

  const submit = async (e) => {
    try {
      let response = await fetch(`http://localhost:5000/api/commande/valider/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idClient: commande && commande.idClient
        }),
      });
      let responsedata = await response.json();
      if (!response.ok) {
        seterror(responsedata.message);
        throw new Error(responsedata.message);
      }
      setsuccess("Commande bien valider.");
    } catch (err) {
      console.log(err);
      seterror(err.message || "probleme!!");
    }
  };

  const submit2 = async (e) => {
    try {
      let response = await fetch(`http://localhost:5000/api/commande/annuler/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idClient: commande && commande.idClient
        }),
      });
      let responsedata = await response.json();
      if (!response.ok) {
        seterror(responsedata.message);
        throw new Error(responsedata.message);
      }
      setsuccess("Commande bien annuler.");
    } catch (err) {
      console.log(err);
      seterror(err.message || "probleme!!");
    }
  };

  return (
    <Container>
      <Row>
        <Col></Col>
        <Col xs={10}>
          <ErrorModel error={error} />
          <SuccessModel success={success} />
          <Form>
            <Button variant="primary" onClick={submit} >
              Valider
              
            </Button>
            <Button style={{marginLeft:'5%'}} onClick={submit2} variant="danger">
              Annuler
            </Button>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Date</Form.Label>
                <Form.Control value={commande && commande.date} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Prix</Form.Label>
                <Form.Control value={commande && commande.prix+"DT"} />
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formGridAddress1">
              <Form.Label>Livraison</Form.Label>
              <Form.Control value={commande && commande.livraison} />
            </Form.Group>

            <Form.Group controlId="formGridAddress2">
              <Form.Label>Payement</Form.Label>
              <Form.Control value={commande && commande.payement} />
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Adresse</Form.Label>
                <Form.Control value={commande && commande.adresse} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Gouvernerat</Form.Label>
                <Form.Control value={commande && commande.gouvernerat} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Statut</Form.Label>
                <Form.Control value={commande && commande.statut} />
              </Form.Group>
            </Form.Row>
          </Form>

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Image</StyledTableCell>
                  <StyledTableCell align="right">Nom</StyledTableCell>
                  <StyledTableCell align="right">Rgion</StyledTableCell>
                  <StyledTableCell align="right">Prix</StyledTableCell>
                  <StyledTableCell align="right">Quantité</StyledTableCell>
                  <StyledTableCell align="right">Description</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list &&
                  list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">
                          <Image
                            src={`http://localhost:5000/${row.image}`}
                            style={{ width: 60, height: 50 }}
                          ></Image>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.nom}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.region}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.prix}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.quantite}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.description}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={list && list.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
