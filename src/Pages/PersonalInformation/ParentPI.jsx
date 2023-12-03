import { Button, Grid, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  selectIsAuthenticated,
  selectUser,
} from "../../redux/userSlice";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { CMTextField } from "../GlobalComponents/CMTextField";
import { Field, Form } from "react-final-form";
import { formatPhoneNumber } from "../EnrollChild/EnrollChild";
import { Alert } from "../StudentAttendance/StudentAttendance";

export const ParentPI = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setMessage("");
  };

  useEffect(() => {
    let api = API_URLS.GET_ENROLLED_CHILDREN + `?email=${user.email}`;

    axios.get(api, HEADER_CONFIG).then(({ data }) => {
      dispatch(loginUser({ ...user, ...data }));
      setData(data);
    });
  }, [refresh]);

  const validate = (values) => {
    const errors = {};
    if (!values) {
      return errors;
    }
    if (!values.ParentFirstName) {
      errors.ParentFirstName = "Required";
    }
    if (!values.ParentLastName) {
      errors.ParentLastName = "Required";
    }

    if (!values.ChildFirstName) {
      errors.consentForm = "Required";
    }
    if (!values.ChildLastName) {
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

    setErrors(errors);
  };

  const onSubmit = (values) => {
    axios
      .post(API_URLS.UPDATE_CHILD_DETAILS, values, HEADER_CONFIG)
      .then(({ data }) => {
        setMessage(data.message);
        setDisabled(true);
      });
  };

  return (
    <Grid
      sx={{
        "& .MuiFormControl-root": {
          marginBottom: "10px",
        },
      }}
    >
      <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
        Personal Information
      </Typography>

      <Form
        style={{ marginBottom: "10px" }}
        onSubmit={onSubmit}
        initialValues={data}
        render={({ handleSubmit, form, values, initialValues }) => (
          <form
            onSubmit={handleSubmit}
            onChange={(value) => {
              for (const key in errors) {
                errors[key] = "";
              }
            }}
          >
            <div>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "10px",
                }}
              >
                Child Details
              </Typography>
              <Field
                name="ChildFirstName"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="First Name"
                    error={errors.FirstName}
                    helperText={errors.FirstName}
                    disabled={disabled}
                  />
                )}
              />
              <Field
                name="ChildLastName"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="Lastname"
                    error={errors.LastName}
                    helperText={errors.LastName}
                    disabled={disabled}
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
                    disabled={disabled}
                  />
                )}
              />
              <Field
                name="ChildDateOfBirth"
                render={({ input }) => (
                  <CMTextField
                    label={"Date of Birth"}
                    disabled={true}
                    {...input}
                  />
                )}
              />
            </div>
            <div>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "10px",
                }}
              >
                Parent Details
              </Typography>
              <Field
                name="ParentFirstName"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="First Name"
                    error={errors.ParentFirstName}
                    helperText={errors.ParentFirstName}
                    disabled={disabled}
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
                    disabled={disabled}
                    helperText={errors.ParentLastName}
                  />
                )}
              />
              <Field
                name="email"
                render={({ input }) => (
                  <CMTextField
                    {...input}
                    label="Email"
                    value={user.email}
                    sx={{ marginBottom: "15px" }}
                    disabled={true}
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
                    disabled={disabled}
                  />
                )}
                // format={formatPhoneNumber}
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
                    disabled={disabled}
                  />
                )}
              />
            </div>
            <Button
              variant="outlined"
              style={{ marginTop: 20, width: "20%", marginRight: "20px" }}
              onClick={() => {
                setDisabled(!disabled);
              }}
            >
              {disabled ? "Edit" : "cancel"}
            </Button>
            {!disabled ? (
              <Button
                variant="contained"
                style={{ marginTop: 20, width: "20%" }}
                onClick={() => {
                  validate(values);
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            ) : null}
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
