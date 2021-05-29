import React, { useState, useEffect } from "react";
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

export default function ListeService() {
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
        const response = await fetch(`http://localhost:5000/api/service/`);

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setList(responseData.service);
      } catch (err) {
        seterror(err.message);
      }
    };

    sendRequest();
  }, []);

  return (
    <Container>
      <Row>
        <Col></Col>
        <Col>
          <ErrorModel error={error} />
          <SuccessModel success={success} />
          <Link to="/ajout-service" >
          <AjoutBTN title="Ajouter un service"/>
          </Link>
          
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Nom</StyledTableCell>
                  <StyledTableCell align="right">type</StyledTableCell>
                  <StyledTableCell align="right">Prix</StyledTableCell>
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
                        <StyledTableCell component="th" scope="row">
                          {row.nom}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.type}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.prix}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.description}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Link to={`/update-service/${row._id}`}>
                            <UpdateIcon style={{ color: "green" }} />
                          </Link>
                          <DeleteForeverIcon
                            style={{ color: "red" }}
                            onClick={async (event) => {
                              try {
                                let response = await fetch(
                                  `http://localhost:5000/api/service/${row._id}`,
                                  {
                                    method: "DELETE",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                  }
                                );
                                let responsedata = await response.json();
                                if (!response.ok) {
                                  throw new Error(responsedata.message);
                                }
                                setList(
                                  list.filter((el) => el._id !== row._id)
                                );
                                setsuccess("Service bien suprimer");
                              } catch (err) {
                                console.log(err);
                                seterror(err.message || "il y a un probleme");
                              }
                            }}
                          />
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
