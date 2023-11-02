import React, { useState, useEffect } from "react";
import {
  Button,
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
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl, FormHelperText } from "@mui/material";
import axios from "axios";
import { API_URLS } from "../GlobalFunctions/APIs";
import { HEADER_CONFIG } from "../GlobalFunctions/API_header_config";

export const CMDatePicker = ({ label, error, helperText, ...props }) => {
  return (
    <FormControl error={true}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          sx={{
            "& input": { padding: "13px 14px" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: error && "#d32f2f",
            },
          }}
          label={label}
          {...props}
          format="MM-DD-YYYY"
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </LocalizationProvider>
    </FormControl>
  );
};
export const formatPhoneNumber = (value) => {
  if (typeof value !== "undefined") {
    return value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
};

export const EnrollChild = () => {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [childrenList, setChildrenList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isClikedSearch, setIsClikedSearch] = useState(false);
  const [EnrollmentID, setEnrollmentID] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(API_URLS.GET_ENROLLED_CHILDREN, HEADER_CONFIG).then((res) => {
      let response = res.data;
      setChildrenList(response);
    });
  }, [refresh]);

  const withdrawChild = () => {
    let payload = {
      enrollmentID: EnrollmentID,
    };
    axios.post(API_URLS.WITHDRAW_CHILD, payload, HEADER_CONFIG).then((res) => {
      let data = res.data;
      setIsWithdrawalOpen(false);
      let updated_data = [];
      childrenList.map((item, index) => {
        if (item.EnrollmentID != EnrollmentID) {
          updated_data.push(item);
        }
      });
      setChildrenList(updated_data);
      setIsClikedSearch(false);
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
    if (!values.Allergies) {
      errors.Allergies = "Required";
    }
    if (!values.dob) {
      errors.dob = "Required";
    }

    if (!values.ParentFirstName) {
      errors.ParentFirstName = "Required";
    }
    if (!values.ParentLastName) {
      errors.ParentLastName = "Required";
    }
    if (!values.PhoneNumber) {
      errors.PhoneNumber = "Required";
    } else if (!/^\d{10}$/.test(values.PhoneNumber)) {
      errors.PhoneNumber = "Invalid phone number (10 digits)";
    }
    if (!values.Address) {
      errors.Address = "Required";
    }
    // if (!values.parentConsentForm) {
    //   errors.parentConsentForm = "Required";
    // }

    setErrors(errors);
  };

  const onSubmit = (values) => {
    const payload = {
      FirstName: values.FirstName,
      LastName: values.LastName,
      dob: `${values.dob.$y}-${values.dob.$M + 1}-${values.dob.$D}`,
      Allergies: values.Allergies,
      ParentFirstName: values.ParentFirstName,
      ParentLastName: values.ParentLastName,
      PhoneNumber: values.PhoneNumber,
      Address: values.Address,
    };

    axios
      .post(API_URLS.ENROLL_CHILD, payload, HEADER_CONFIG)
      .then(({ data }) => {
        setIsOpen(false);
        setRefresh(refresh + 1);
        window.alert(data.message);
      });
  };

  const styles = {
    conatiner: {
      padding: "10px",
      "& .MuiFormControl-root": {
        marginBottom: "10px",
      },
    },
    heading: {
      fontSize: "20px",
      fontWeight: "bold",
      mt: "15px",
      mb: "7px",
    },
  };

  return (
    <Grid>
      <Grid container md={8} item>
        <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
          Child Enrollment
        </Typography>
      </Grid>
      <Button
        variant="outlined"
        style={{ marginTop: 20, marginBottom: 20 }}
        onClick={() => setIsOpen(true)}
      >
        Enroll Child
      </Button>
      <Button
        variant="outlined"
        style={{ marginTop: 20, marginBottom: 20, marginLeft: 10 }}
        onClick={() => setIsWithdrawalOpen(true)}
      >
        Withdraw Child
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
              <TableCell>EnrollmentID</TableCell>
              <TableCell align="center">Enrollment Date</TableCell>
              <TableCell align="center">Child Firstname</TableCell>
              <TableCell align="center">Child Lastname</TableCell>
              <TableCell align="center">DOB</TableCell>
              <TableCell align="center">Allergies</TableCell>
              <TableCell align="center">Parent Names</TableCell>
              <TableCell align="center">PhoneNumber</TableCell>
              <TableCell align="center">Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {childrenList.map((row, index) => (
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
                  {row.EnrollmentID}
                </TableCell>
                <TableCell align="center">{row.enrollmentDate}</TableCell>
                <TableCell align="center">{row.ChildFirstName}</TableCell>
                <TableCell align="center">{row.ChildLastName}</TableCell>
                <TableCell align="center">{row.ChildDateOfBirth}</TableCell>
                <TableCell align="center">{row.Allergies}</TableCell>
                <TableCell align="center">
                  {row.ParentFirstName} {row.ParentLastName}
                </TableCell>
                <TableCell align="center">{row.PhoneNumber}</TableCell>
                <TableCell align="center">{row.Address}</TableCell>
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
            render={({ handleSubmit, form, values }) => (
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
                  <Typography sx={styles.heading}>Child Details</Typography>
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
                    name="LastName"
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
                    name="Allergies"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Allergies"
                        error={errors.Allergies}
                        helperText={errors.Allergies}
                      />
                    )}
                  />
                  <Field
                    name="dob"
                    render={({ input }) => (
                      <CMDatePicker
                        label={"Date of Birth"}
                        error={errors.dob}
                        helperText={errors.dob}
                        {...input}
                      />
                    )}
                  />
                </div>
                <div>
                  <Typography sx={styles.heading}>Parent Details</Typography>
                  <Field
                    name="ParentFirstName"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="First Name"
                        error={errors.ParentFirstName}
                        helperText={errors.ParentFirstName}
                      />
                    )}
                  />
                  <Field
                    name="ParentLastName"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Last Name"
                        error={errors.ParentLastName}
                        helperText={errors.ParentLastName}
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
                  {/* <Field
                    name="parentConsentForm"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Consent Form"
                        error={errors.parentConsentForm}
                        helperText={errors.parentConsentForm}
                      />
                    )}
                  /> */}
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
          <Typography sx={styles.heading}>Withdraw Child</Typography>
          {isClikedSearch ? (
            <>
              {childrenList.map((item, index) => {
                console.log(item);
                return item.EnrollmentID == EnrollmentID ? (
                  <Grid>
                    <Typography>EnrollmentID: {item.EnrollmentID}</Typography>
                    <Typography>
                      Enrollment Date: {item.enrollmentDate}
                    </Typography>
                    <Typography>
                      Child Firstname: {item.ChildFirstName}
                    </Typography>
                    <Typography>
                      Child Lastname: {item.ChildLastName}
                    </Typography>
                    <Typography>DOB: {item.ChildDateOfBirth}</Typography>
                    <Typography>Allergies: {item.Allergies}</Typography>
                    <Typography>
                      Parent Names: {item.ParentFirstName} {item.ParentLastName}
                    </Typography>
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
              onChange={(event) => setEnrollmentID(event.target.value)}
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
              isClikedSearch ? withdrawChild() : setIsClikedSearch(true)
            }
          >
            {isClikedSearch ? "Submit" : "Search"}
          </Button>
        </Grid>
      </Dialog>
    </Grid>
  );
};
