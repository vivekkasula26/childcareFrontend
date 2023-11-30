import { Button, Grid, Typography, Paper } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CMTextField } from "../GlobalComponents/CMTextField";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import { API_URLS } from "../GlobalFunctions/APIs";
import { ROUTE_PATH } from "../GlobalFunctions/routePath";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/userSlice";

const LoginModel = ({}) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [helperText, setHelperText] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);

  const onInputChange = (value, setDetails) => {
    setErrorMessage("");
    setHelperText({ username: "", password: "" });
    setDetails(value);
  };

  const onClickLogin = () => {
    if (!userName || !password) {
      setHelperText({
        username: userName ? "" : "Please enter username",
        password: password ? "" : "please enter password",
      });

      return;
    }

    let payload = {
      userName: userName,
      password: password,
    };

    return axios
      .post(API_URLS.ON_LOGIN, payload, HEADER_CONFIG)
      .then((response) => {
        let resp = response.data;
        if (resp.success) {
          dispatch(loginUser(resp.user));
          navigate(ROUTE_PATH.DASHBOARD);
        } else {
          setErrorMessage(resp.message);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <Paper
      component={Grid}
      container
      sx={styles.container}
      elevation={4}
      md={7}
      item
    >
      <Grid md={7} sx={styles.internalContainer} sm={12} item>
        <Grid sx={styles.loginHeading}>
          <Typography variant="h6">Welcome Back!</Typography>
          <Typography>Sign in to your account</Typography>
        </Grid>
        <Grid md={10} item>
          <CMTextField
            placeholder={"User Name"}
            sx={{ marginBottom: "15px" }}
            onChange={(event) => {
              onInputChange(event.target.value, setUserName);
            }}
            helperText={helperText.username}
            error={Boolean(helperText.username)}
            label="User Name"
          />
          <CMTextField
            placeholder={"Password"}
            sx={{ marginBottom: "15px" }}
            type={"password"}
            onChange={(event) => {
              onInputChange(event.target.value, setPassword);
            }}
            helperText={helperText.password}
            error={Boolean(helperText.password)}
            label="Password"
          />

          <Typography
            sx={{
              mt: "10px",
              fontSize: "12px",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Forgot Password?
          </Typography>
          {errorMessage ? (
            <Typography style={{ fontSize: 12, color: "red" }}>
              {errorMessage}
            </Typography>
          ) : null}
          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: "10px", borderRadius: 20, width: "60%" }}
            onClick={onClickLogin}
          >
            Login
          </Button>
        </Grid>
      </Grid>
      <Grid md={5} item style={{ padding: 15, paddingTop: 35 }}>
        <Typography sx={{ mt: "10px" }} variant="h6">
          Dont have an Account?
        </Typography>
        <Typography sx={{ fontSize: "14px", mt: "25px" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s
        </Typography>
        <Button
          variant="outlined"
          fullWidth={true}
          sx={{ borderRadius: 20, mt: "20px" }}
          onClick={() => navigate(ROUTE_PATH.CREATE_ACCOUNT)}
        >
          Create Account
        </Button>
      </Grid>
    </Paper>
  );
};

export const LoginPage = () => {
  return (
    <Grid>
      <LoginModel />
    </Grid>
  );
};

const styles = {
  container: {
    display: "flex",
    flexFlow: "row",
    marginX: "auto",
    mt: "130px",
    borderRadius: "10px",
  },
  loginHeading: {
    pb: "20px",
  },
  internalContainer: {
    padding: "15px",
    paddingTop: "35px",
    paddingBottom: "25px",
    borderRight: "1px solid",
    borderRightColor: "#dad2d2",
  },
};
