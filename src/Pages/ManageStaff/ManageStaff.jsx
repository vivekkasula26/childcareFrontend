import React, { useEffect, useState } from "react";
import {
  Button,
  ClickAwayListener,
  Dialog,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Form, Field } from "react-final-form";
import { CMTextField } from "../GlobalComponents/CMTextField";
import { API_URLS } from "../GlobalFunctions/APIs";
import { HEADER_CONFIG } from "../GlobalFunctions/API_header_config";
import axios from "axios";
import { CMDatePicker, formatPhoneNumber } from "../EnrollChild/EnrollChild";

export const ManageStaff = () => {
  const [hiredStaff, setHiredStaff] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isClikedSearch, setIsClikedSearch] = useState(false);
  const [staffID, setStaffID] = useState("");

  const styles = {
    heading: {
      fontSize: "25px",
      fontWeight: 400,
      mt: "15px",
      mb: "7px",
      fontFamily: "sans-serif",
      fontWeight: "bold",
    },
    conatiner: {
      padding: "15px",
      "& .MuiFormControl-root": {
        marginBottom: "10px" /* Adjust the margin as needed */,
      },
    },
  };

  useEffect(() => {
    axios.get(API_URLS.GET_HIRED_STAFF, HEADER_CONFIG).then((response) => {
      let data = response.data;
      setHiredStaff(data);
    });
  }, []);

  const onSubmit = (values) => {
    return;
    const payload = {
      FirstName: values.FirstName,
      LastName: values.LastName,
      dob: `${values.dob.$y}-${values.dob.$M + 1}-${values.dob.$D}`,
      HourlySalary: values.HourlySalary,
      PhoneNumber: values.PhoneNumber,
      Address: values.Address,
    };

    axios.post(API_URLS.HIRE_STAFF, payload, HEADER_CONFIG).then(({ data }) => {
      setIsOpen(false);
      setRefresh(refresh + 1);
      window.alert(data.message);
    });
  };

  const validate = (values) => {
    const errors = {};

    if (!values) {
      return errors;
    }

    if (!values.FirstName) {
      errors.FirstName = "Required";
    }
    if (!values.LastName) {
      errors.LastName = "Required";
    }
    if (!values.dob) {
      errors.dob = "Required";
    }
    if (!values.PhoneNumber) {
      errors.PhoneNumber = "Required";
    } else if (!/^\d{10}$/.test(values.PhoneNumber)) {
      errors.PhoneNumber = "Invalid phone number (10 digits)";
    }
    if (!values.Address) {
      errors.Address = "Required";
    }
    if (!values.HourlySalary) {
      errors.HourlySalary = "Required";
    }

    setErrors(errors);
    // return errors;
  };

  const withdrawStaff = () => {
    let payload = {
      ID: staffID,
    };
    axios
      .post(API_URLS.WITHDRAW_STAFF, payload, HEADER_CONFIG)
      .then((res) => {
        let data = res.data;
        setIsWithdrawalOpen(false);
        let updated_data = [];
        hiredStaff.map((item, index) => {
          if (item.ID != staffID) {
            updated_data.push(item);
          }
        });
        setHiredStaff(updated_data);
        setIsClikedSearch(false);
      })
      .finally(() => window.alert(data.message));
  };

  return (
    <Grid>
      <Grid container md={8} item>
        <Typography
          style={{ fontSize: 28, fontWeight: "bold", fontFamily: "sans-serif" }}
        >
          Manage Staff
        </Typography>
      </Grid>
      <Button
        variant="outlined"
        style={{ marginTop: 20, marginBottom: 20 }}
        onClick={() => setIsOpen(true)}
      >
        Hire Staff
      </Button>
      <Button
        variant="outlined"
        style={{ marginTop: 20, marginBottom: 20, marginLeft: "15px" }}
        onClick={() => setIsWithdrawalOpen(true)}
      >
        Withdraw Staff
      </Button>

      <TableContainer style={{ border: "1px solid ", borderColor: "#e6e6e6" }}>
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
              <TableCell>Staff ID</TableCell>
              <TableCell align="center">Firstname</TableCell>
              <TableCell align="center">Lastname</TableCell>
              <TableCell align="center">DOB</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">PhoneNumber</TableCell>
              <TableCell align="center">HourlySalary</TableCell>
              <TableCell align="center">HireDate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hiredStaff.map((row, index) => (
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
                <TableCell component="th" scope="row">
                  {row.ID}
                </TableCell>
                <TableCell align="center">{row.FirstName}</TableCell>
                <TableCell align="center">{row.LastName}</TableCell>
                <TableCell align="center">{row.DOB}</TableCell>
                <TableCell align="center">{row.Address}</TableCell>
                <TableCell align="center">{row.PhoneNumber}</TableCell>
                <TableCell align="center">{row.HourlySalary}</TableCell>
                <TableCell align="center">{row.HireDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Grid sx={styles.conatiner}>
          <Form
            style={{ marginBottom: "10px" }}
            onSubmit={onSubmit}
            render={({ handleSubmit, values }) => (
              <form
                onSubmit={handleSubmit}
                className={styles.form}
                onChange={() => {
                  for (const key in errors) {
                    errors[key] = "";
                  }
                  setData(values);
                }}
              >
                <div>
                  <Typography sx={styles.heading}>Staff Details</Typography>
                  <Field
                    name="FirstName"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="First Name"
                        error={errors.FirstName}
                        helperText={errors.FirstName}
                      />
                    )}
                  />
                  <Field
                    name="lastName"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Last Name"
                        error={errors.LastName}
                        helperText={errors.LastName}
                      />
                    )}
                  />

                  <Field
                    name="Address"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Address"
                        error={errors.Address}
                        helperText={errors.Address}
                      />
                    )}
                  />
                  <Field
                    name="PhoneNumber"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Phone Number"
                        type="tel"
                        error={errors.PhoneNumber}
                        helperText={errors.PhoneNumber}
                      />
                    )}
                    format={formatPhoneNumber}
                    parse={(value) => value.replace(/[^\d]/g, "").slice(0, 10)}
                  />
                  <Field
                    name="HourlySalary"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Hourly Salary"
                        error={errors.HourlySalary}
                        helperText={errors.HourlySalary}
                      />
                    )}
                    parse={(value) => value.replace(/[^\d]/g, "")}
                  />
                  <Field
                    name="dob"
                    render={({ input }) => (
                      <CMDatePicker
                        label={"Date of Birth"}
                        error={errors.dob}
                        helperText={errors.dob}
                      />
                    )}
                  />
                </div>
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
              </form>
            )}
          />
        </Grid>
      </Dialog>
      <Dialog
        open={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
      >
        <Grid sx={{ padding: "15px" }}>
          <Typography sx={styles.heading}>Withdraw Staff</Typography>
          {isClikedSearch ? (
            <>
              {hiredStaff.map((item, index) => {
                return item.ID == staffID ? (
                  <Grid>
                    <Typography>Staff ID: {item.ID}</Typography>
                    <Typography>Hire Date: {item.HireDate}</Typography>
                    <Typography>Firstname: {item.FirstName}</Typography>
                    <Typography>Lastname: {item.LastName}</Typography>
                    <Typography>DOB: {item.DOB}</Typography>
                    <Typography>Hourly Salary : {item.HourlySalary}</Typography>
                    <Typography>PhoneNumber: {item.PhoneNumber}</Typography>
                    <Typography>Address: {item.Address}</Typography>
                  </Grid>
                ) : (
                  <></>
                );
              })}
            </>
          ) : (
            <CMTextField
              placeholder="Enter EnrollmentID"
              label="Enter EnrollmentID"
              onChange={(event) => setStaffID(event.target.value)}
            />
          )}
          {isClikedSearch ? (
            <Typography sx={{ marginY: "10px" }}>
              Check the details and confirm
            </Typography>
          ) : null}
          <Button
            variant="contained"
            sx={{ mt: "20px" }}
            onClick={() =>
              isClikedSearch ? withdrawStaff() : setIsClikedSearch(true)
            }
          >
            {isClikedSearch ? "Submit" : "Search"}
          </Button>
        </Grid>
      </Dialog>
    </Grid>
  );
};
