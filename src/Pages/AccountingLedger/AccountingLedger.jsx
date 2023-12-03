import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import { CMTextField } from "../GlobalComponents/CMTextField";
import { CMDatePicker } from "../EnrollChild/EnrollChild";
import { Field, Form } from "react-final-form";

export const AccountingLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const isParent = user.role && user.role == "Parent";
  const [selectedPaymentDate, setSelectedPaymentDate] = useState("");
  const [payloadData, setPayloadData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const onSubmit = (values) => {
    let payload = {
      id: user.ChildID,
      generatedDate: selectedPaymentDate,
      amount: selectedAmount,
      ...values,
      expiry: `${values.expiry.$y}-${values.expiry.$M + 1}`,
    };

    axios
      .post(API_URLS.MAKE_PAYMENT, payload, HEADER_CONFIG)
      .then(({ data }) => {
        closePayment();
        setRefresh(refresh + 1);
        window.alert(data.message);
      });
  };

  const closePayment = () => {
    setPayloadData({});
    setSelectedPaymentDate("");
    setSelectedAmount(0);
  };

  const validate = (values) => {
    const errors = {};
    if (!values) {
      return errors;
    }
    if (!values.name) {
      errors.name = "Required";
    }
    if (!values.date) {
      errors.date = "Required";
    }
    if (!values.cardNumber) {
      errors.cardNumber = "Required";
    }
    if (!values.cvv) {
      errors.cvv = "Required";
    }

    setErrors(errors);
  };

  useEffect(() => {
    axios
      .get(
        API_URLS.GET_STUDENT_LEDGER + (isParent ? `?id=${user.ChildID}` : ""),
        HEADER_CONFIG
      )
      .then(({ data }) => {
        console.log(data);
        debugger;
        setLedgerData(data);
      });
  }, [refresh]);

  return (
    <Grid>
      <Grid container md={8} item>
        <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
          Student Ledger
        </Typography>
      </Grid>
      <TableContainer
        style={{
          border: "1px solid ",
          borderColor: "#e6e6e6",
          marginTop: "20px",
        }}
      >
        <Table
          sx={{ minWidth: 650, backgroundColor: "#fafafd" }}
          aria-label="simple table"
        >
          <TableHead sx={{ backgroundColor: "#e1e2e48f" }}>
            <TableRow
              sx={{
                "& .MuiTableCell-root": {
                  borderRight: "1px solid lightgray",
                  fontSize: "12px",
                  padding: "10px",
                  borderColor: "#e6e6e6",
                },
              }}
            >
              <TableCell align="center">Child ID</TableCell>
              <TableCell align="center">Firstname</TableCell>
              <TableCell align="center">Lastname</TableCell>
              <TableCell align="center">Parent Name</TableCell>
              <TableCell align="center">PhoneNumber</TableCell>
              <TableCell align="center">Balance</TableCell>
              {/* <TableCell align="center">Paid</TableCell> */}
              <TableCell align="center">Generated Date</TableCell>
              {isParent && <TableCell align="center">Payment</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {ledgerData.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{
                  "& .MuiTableCell-root": {
                    borderRight: "1px solid",
                    fontSize: "12px",
                    padding: "10px",
                    borderColor: "#e6e6e6",
                  },
                }}
              >
                <TableCell align="center" scope="row">
                  {row.ChildID}
                </TableCell>
                <TableCell align="center">{row.ChildFirstName}</TableCell>
                <TableCell align="center">{row.ChildLastName}</TableCell>
                <TableCell align="center">
                  {row.ParentFirstName} {row.ParentLastName}
                </TableCell>
                <TableCell align="center">{row.PhoneNumber}</TableCell>
                <TableCell align="center">
                  {row.balance
                    ? `$${row.balance}`
                    : row.GeneratedDate
                    ? "0"
                    : "Pending"}
                </TableCell>
                {/* <TableCell align="center">
                  {row.totalPaid ? `$${row.totalPaid}` : "Pending"}
                </TableCell> */}
                <TableCell align="center">
                  {row.GeneratedDate || "Pending"}
                </TableCell>
                {isParent && (
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setSelectedPaymentDate(row.GeneratedDate);
                        setSelectedAmount(row.balance);
                      }}
                      disabled={!row.balance}
                    >
                      Pay
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={selectedPaymentDate} onClose={closePayment}>
        <Grid sx={{ padding: "15px" }}>
          <Typography
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              mt: "15px",
              mb: "7px",
            }}
          >
            Make Payment
          </Typography>
          <Form
            style={{ marginBottom: "10px" }}
            onSubmit={onSubmit}
            render={({ handleSubmit, form, values }) => (
              <form
                onSubmit={handleSubmit}
                onChange={() => {
                  setPayloadData(values);
                }}
              >
                <Field
                  name="cardNumber"
                  render={({ input }) => (
                    <CMTextField
                      label="Card Number"
                      sx={{ mb: "10px" }}
                      {...input}
                    />
                  )}
                />
                <Field
                  name="name"
                  render={({ input }) => (
                    <CMTextField
                      label="Name on Card"
                      sx={{ mb: "10px" }}
                      {...input}
                    />
                  )}
                />
                <Field
                  name="cvv"
                  render={({ input }) => (
                    <CMTextField label="CVV" sx={{ mb: "10px" }} {...input} />
                  )}
                />
                <Field
                  name="expiry"
                  render={({ input }) => (
                    <CMDatePicker
                      label={"Expiry"}
                      sx={{ mb: "10px" }}
                      {...input}
                      views={["month", "year"]}
                      format={"MM-YYYY"}
                    />
                  )}
                />
                <Grid>
                  <Button
                    variant="contained"
                    style={{ marginTop: 10, width: "30%" }}
                    onClick={() => {
                      validate(values);
                      handleSubmit();
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </form>
            )}
          />
        </Grid>
      </Dialog>
    </Grid>
  );
};
