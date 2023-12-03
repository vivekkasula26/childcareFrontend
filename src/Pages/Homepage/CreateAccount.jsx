import React, { useState, useEffect } from "react";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { CMTextField } from "../GlobalComponents/CMTextField";
import { formatPhoneNumber } from "../EnrollChild/EnrollChild";
import MenuItem from "@mui/material/MenuItem";
import { Field, Form } from "react-final-form";
import { API_URLS } from "../GlobalFunctions/APIs";
import axios from "axios";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../GlobalFunctions/routePath";

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const CreateAccount = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const validate = (values) => {
    const errors = {};
    if (!values) {
      return errors;
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

  const onSubmit = (values) => {
    const payload = {
      userName: values.userName,
      password: values.password,
      email: values.email,
      roles: selectedUser,
    };

    axios
      .post(API_URLS.CREATE_ACCOUNT, payload, HEADER_CONFIG)
      .then(({ data }) => {
        window.alert(data.message);

        navigate(ROUTE_PATH.HOME_PAGE);
      });
  };

  return (
    <Grid
      style={{
        padding: "30px",
        display: "flex",
        justifyContent: "center",
      }}
      container
    >
      <Grid md={7} item>
        <Paper elevation={3} style={{ padding: "20px", display: "flex" }}>
          <Grid
            md={7}
            item
            sx={{
              display: "flex",
              flexFlow: "column",
              paddingRight: "20px",
              borderRight: "1px solid",
              borderColor: "lightgrey",
            }}
          >
            <Form
              onSubmit={onSubmit}
              render={({ handleSubmit, form, values }) => (
                <form
                  style={{ flexFlow: "column", display: "flex" }}
                  onSubmit={handleSubmit}
                  className={styles.form}
                  onChange={() => {
                    for (const key in errors) {
                      errors[key] = "";
                    }
                    setData(values);
                  }}
                >
                  <Typography sx={styles.heading}>Create Account</Typography>
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
                    name="user"
                    render={({ input }) => (
                      <TextField
                        {...input}
                        select
                        label="Select User"
                        sx={{ width: "200px" }}
                        size="small"
                        onChange={handleUserChange}
                        value={selectedUser}
                      >
                        <MenuItem value={"Teacher"}>Teacher</MenuItem>
                        <MenuItem value={"Parent"}>Parent</MenuItem>
                      </TextField>
                    )}
                  />

                  <Button
                    variant="contained"
                    style={{ marginTop: 20, width: "30%" }}
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
          <Grid md={5} item sx={{ paddingLeft: "20px" }}>
            <Typography
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                marginBottom: "20px",
              }}
            >
              Child Care Management
            </Typography>
            <Typography>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </Typography>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
