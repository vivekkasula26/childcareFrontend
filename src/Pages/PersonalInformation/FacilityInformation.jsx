import { Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";

export const Facilityinformation = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const [data, setData] = useState({});

  useEffect(() => {
    console.log(user);
    let api = API_URLS.GET_FACILITY_INFORMATION + `?id=${user.id}`;

    axios.get(api, HEADER_CONFIG).then(({ data }) => {
      console.log(data);
      setData(data);
    });
  }, []);

  const style = {
    box: {
      padding: "7px",
      border: "1px solid",
      borderColor: "#08255c",
      borderRadius: "5px",
    },
  };

  return (
    <Grid>
      <Typography style={{ fontSize: 25, fontWeight: "bold" }}>
        Facility Information
      </Typography>
      <Paper elevation={4} style={{ marginTop: "20px" }}>
        <Grid container display={"flex"} flexDirection={"row"} md={12}>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>Facility Name</Typography>
            <Typography style={style.box}>{data.name}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>License number</Typography>
            <Typography style={style.box}>{data.licenseNumber}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>Phonenumber</Typography>
            <Typography style={style.box}>{data.facilityPhone}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}> Address</Typography>
            <Typography style={style.box}>{data.Address}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Typography
        style={{ fontSize: 25, fontWeight: "bold", marginTop: "25px" }}
      >
        Facility Admin Information
      </Typography>
      <Paper elevation={4} style={{ marginTop: "20px" }}>
        <Grid container display={"flex"} flexDirection={"row"} md={12}>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>Firstname</Typography>
            <Typography style={style.box}>{data.firstName}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>Lastname</Typography>
            <Typography style={style.box}>{data.lastName}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>Email</Typography>
            <Typography style={style.box}>{data.email}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>Phonenumber</Typography>
            <Typography style={style.box}>{data.phoneNumber}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
