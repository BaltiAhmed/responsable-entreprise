import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Container, Row, Col, Image } from "react-bootstrap";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import TablePagination from "@material-ui/core/TablePagination";
import ErrorModel from "../../models/error-models";
import SuccessModel from "../../models/success-models";
import NaturePeopleIcon from "@material-ui/icons/NaturePeople";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import AgriculteurModal from "../../components/demande-service/agriculteur-modal";
import ServiceModal from "../../components/demande-service/service-modal";
import CancelIcon from "@material-ui/icons/Cancel";

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

export default function ListDemandeProduit() {
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
  const [error, seterror] = useState(null);
  const [success, setsuccess] = useState(null);

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/produit/`);

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setList(responseData.produit);
      } catch (err) {
        seterror(err.message);
      }
    };

    sendRequest();
  }, []);
  console.log(list);

  const [modalAgriculteur, setModalAgriculteur] = React.useState(false);
  const [modalService, setModalService] = React.useState(false);
  const [agriculteurId, setAgriculteurId] = useState(null);
  const [serviceId, setServiceId] = useState(null);

  const showModalAgriculteur = (id) => {
    
    setAgriculteurId(id);
    setModalAgriculteur(true);
  };
  console.log(agriculteurId)

  return (
    <Container>
      <Row>
        <Col></Col>
        <Col xs={10}>
          <AgriculteurModal
            show={modalAgriculteur}
            onHide={() => setModalAgriculteur(false)}
            id={agriculteurId}
          />
          <ServiceModal
            show={modalService}
            onHide={() => setModalService(false)}
            id={serviceId}
          />
          <ErrorModel error={error} />
          <SuccessModel success={success} />

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Image</StyledTableCell>
                  <StyledTableCell>Nom</StyledTableCell>

                  <StyledTableCell align="right">Région</StyledTableCell>
                  <StyledTableCell align="right">Prix</StyledTableCell>
                  <StyledTableCell align="right">Quantité</StyledTableCell>
                  <StyledTableCell align="right">Description</StyledTableCell>

                  <StyledTableCell align="right">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list &&
                  list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell>
                          <Image
                            style={{ width: "50px", height: "50px" }}
                            src={`http://localhost:5000/${row.image}`}
                          />
                        </StyledTableCell>
                        <StyledTableCell>{row.nom}</StyledTableCell>
                        <StyledTableCell>{row.region}</StyledTableCell>
                        <StyledTableCell>{row.prix}</StyledTableCell>
                        <StyledTableCell>{row.quantite}</StyledTableCell>
                        <StyledTableCell align="right">
                          {row.description}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <NaturePeopleIcon
                            onClick={() =>
                              showModalAgriculteur(row.Agriculteur)
                            }
                            style={{ color: "green" }}
                            fontSize="large"
                          />

                          {!row.finished && (
                            <ThumbUpIcon
                              style={{ color: "#4fc3f7" }}
                              fontSize="large"
                              onClick={async (event) => {
                                try {
                                  let response = await fetch(
                                    `http://localhost:5000/api/produit/${row._id}`,
                                    {
                                      method: "PATCH",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        idAgriculteur: row.Agriculteur,
                                      }),
                                    }
                                  );
                                  let responsedata = await response.json();
                                  if (!response.ok) {
                                    seterror(responsedata.message);
                                    throw new Error(responsedata.message);
                                  }
                                  setsuccess(
                                    "Un Email de confirmation sera envoyer à l'agriculteur"
                                  );
                                } catch (err) {
                                  console.log(err);
                                  seterror(err.message || "probleme!!");
                                }
                              }}
                            />
                          )}

                          {!row.finished && (
                            <CancelIcon
                              style={{ color: "red" }}
                              fontSize="large"
                              onClick={async (event) => {
                                try {
                                  let response = await fetch(
                                    `http://localhost:5000/api/produit/refu/${row._id}`,
                                    {
                                      method: "PATCH",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        idAgriculteur: row.Agriculteur,
                                      }),
                                    }
                                  );
                                  let responsedata = await response.json();
                                  if (!response.ok) {
                                    seterror(responsedata.message);
                                    throw new Error(responsedata.message);
                                  }
                                  setsuccess(
                                    "Un Email de confirmation sera envoyer à l'agriculteur"
                                  );
                                } catch (err) {
                                  console.log(err);
                                  seterror(err.message || "probleme!!");
                                }
                              }}
                            />
                          )}
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
