import React, { useState } from "react";
import { Button, Grid, Snackbar, Typography } from "@mui/material";
import { CMTextField } from "../../GlobalComponents/CMTextField";
import { Form, Field } from "react-final-form";
import { formatPhoneNumber } from "../../EnrollChild/EnrollChild";
import axios from "axios";
import { validateEmail } from "../../Homepage/CreateAccount";
import { API_URLS } from "../../GlobalFunctions/APIs";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";
import { getHeaderConfig } from "../../GlobalFunctions/API_header_config";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../StudentAttendance/StudentAttendance";
import { ROUTE_PATH } from "../../GlobalFunctions/routePath";

export const AdminDashboard = () => {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const user = useSelector(selectUser);
  const [message, setMessage] = useState("");

  const HEADER_CONFIG = getHeaderConfig(user);
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setMessage("");
  };

  const onSubmit = (values) => {
    let payload = {
      ...values,
      roles: "Admin",
    };

    console.log(values);
    axios
      .post(API_URLS.CREATE_FACILITY_ACCOUNT, payload, HEADER_CONFIG)
      .then(({ data }) => {
        setMessage(data.message);
        navigate(ROUTE_PATH.HOME_PAGE);
      });
  };

  const styles = {
    heading: {
      fontSize: "20px",
      fontWeight: "bold",
      mt: "15px",
      mb: "7px",
    },
    conatiner: {
      "& .MuiFormControl-root": {
        marginBottom: "10px",
      },
    },
  };
  const validate = (values, check) => {
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

    if (!values.facilityName) {
      errors.facilityName = "Required";
    }
    if (!values.facilityAddress) {
      errors.facilityAddress = "Required";
    }
    if (!values.PhoneNumber) {
      errors.PhoneNumber = "Required";
    } else if (!/^\d{10}$/.test(values.PhoneNumber)) {
      errors.PhoneNumber = "Invalid phone number (10 digits)";
    }
    if (!values.facilityPhoneNumber) {
      errors.facilityPhoneNumber = "Required";
    } else if (!/^\d{10}$/.test(values.facilityPhoneNumber)) {
      errors.facilityPhoneNumber = "Invalid phone number (10 digits)";
    }
    if (!values.licenseNumber) {
      errors.licenseNumber = "Required";
    }
    if (!values.userName) {
      errors.userName = "Required";
    }
    if (!values.password) {
      errors.password = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (!validateEmail(values.email)) {
      errors.email = "Invalid email address";
    }

    setErrors(errors);
  };

  return (
    <Grid sx={styles.conatiner} container md={8} item>
      <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
        Create an Account for a Facility
      </Typography>
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
              <Typography sx={styles.heading}>Facility Details</Typography>
              <Field
                name="facilityName"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="Facility Name"
                    error={errors.facilityName}
                    helperText={errors.facilityName}
                    sx={{ marginBottom: "15px" }}
                  />
                )}
              />
              <Field
                name="facilityAddress"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="Facility Address"
                    error={errors.facilityAddress}
                    helperText={errors.facilityAddress}
                    sx={{ marginBottom: "15px" }}
                  />
                )}
              />

              <Field
                name="facilityPhoneNumber"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="Phone Number"
                    type="tel"
                    error={errors.facilityPhoneNumber}
                    helperText={errors.facilityPhoneNumber}
                    sx={{ marginBottom: "15px" }}
                  />
                )}
                format={formatPhoneNumber}
                parse={(value) => value.replace(/[^\d]/g, "").slice(0, 10)}
              />
              <Field
                name="licenseNumber"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="License Number"
                    type="tel"
                    error={errors.licenseNumber}
                    helperText={errors.licenseNumber}
                    sx={{ marginBottom: "15px" }}
                  />
                )}
              />
            </div>
            <div>
              <Typography sx={styles.heading}>
                Facility Admin Details
              </Typography>
              <Field
                name="FirstName"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="First Name"
                    error={errors.FirstName}
                    helperText={errors.FirstName}
                    sx={{ marginBottom: "15px" }}
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
                    sx={{ marginBottom: "15px" }}
                  />
                )}
              />
              <Field
                name="userName"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="Username"
                    error={errors.userName}
                    helperText={errors.userName}
                    sx={{ marginBottom: "15px" }}
                  />
                )}
              />
              <Field
                name="email"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="Email"
                    error={errors.email}
                    helperText={errors.email}
                    sx={{ marginBottom: "15px" }}
                  />
                )}
              />
              <Field
                name="password"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="Password"
                    error={errors.password}
                    helperText={errors.password}
                    sx={{ marginBottom: "15px" }}
                    type="password"
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
                    sx={{ marginBottom: "15px" }}
                  />
                )}
                format={formatPhoneNumber}
                parse={(value) => value.replace(/[^\d]/g, "").slice(0, 10)}
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
      <Snackbar open={message} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
