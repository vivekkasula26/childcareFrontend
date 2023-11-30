import React, { useState } from "react";
import { Grid, Typography, Button, Paper, Container } from "@mui/material";
import { CMTextField } from "../../GlobalComponents/CMTextField";
import { API_URLS } from "../../GlobalFunctions/APIs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../GlobalFunctions/routePath";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../../redux/userSlice";
import { getHeaderConfig } from "../../GlobalFunctions/API_header_config";

export const AdminLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [helperText, setHelperText] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
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
      .post(API_URLS.ON_ADMIN_LOGIN, payload, HEADER_CONFIG)
      .then((response) => {
        let resp = response.data;
        if (resp.success) {
          navigate(ROUTE_PATH.ADMIN_DASHBOARD);
          console.log(resp.user);
        } else {
          setErrorMessage(resp.message);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const styles = {
    container: {
      display: "flex",
      flexFlow: "row",
      "& .MuiFormControl-root": {
        marginBottom: "15px" /* Adjust the margin as needed */,
      },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ paddingY: "45px", paddingTop: "130px" }}>
      <Grid container justifyContent="center" alignItems="center">
        <Paper component={Grid} elevation={3} item md={7} sx={styles.container}>
          <Grid
            item
            md={7}
            sx={{
              borderRight: "1px solid",
              padding: "20px",
              borderColor: "#dad2d2",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "15px" }}>
              Admin Login
            </Typography>

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
            {errorMessage ? (
              <Typography
                style={{ fontSize: 12, color: "red", marginBottom: "10px" }}
              >
                {errorMessage}
              </Typography>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              onClick={onClickLogin}
              style={{ marginTop: "10px" }}
            >
              Login
            </Button>
          </Grid>
          <Grid item md={5} sx={{ padding: "20px" }}>
            <Typography variant="h6" style={{ marginBottom: "10px" }}>
              Unable to Login?
            </Typography>
            <Typography variant="subtitle2">
              Contact the Tech team for troubleshooting
            </Typography>
            <Typography sx={{ marginTop: "10px" }} variant="subtitle2">
              Email: vivekTech@gmail.com
            </Typography>
            <Typography variant="subtitle2">Phone: 555-555-5555</Typography>
          </Grid>
        </Paper>
      </Grid>
    </Container>
  );
};
