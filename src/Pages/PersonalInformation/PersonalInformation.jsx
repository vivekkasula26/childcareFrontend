import { Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";

export const PersonalInformation = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const [data, setData] = useState({});

  useEffect(() => {
    let api = API_URLS.GET_STAFF_PERSONAL_INFORMATION + `/${user.email}`;

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
      <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
        Personal Information
      </Typography>
      <Paper elevation={4} style={{ marginTop: "20px" }}>
        <Grid container display={"flex"} flexDirection={"row"} md={12}>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>Firstname</Typography>
            <Typography style={style.box}>{data.FirstName}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>Lastname</Typography>
            <Typography style={style.box}>{data.LastName}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>Date of Birth</Typography>
            <Typography style={style.box}>{data.DOB}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}> Address</Typography>
            <Typography style={style.box}>{data.Address}</Typography>
          </Grid>
          <Grid md={4} item style={{ padding: "10px" }}>
            <Typography style={{ fontSize: "14px" }}>HireDate</Typography>
            <Typography style={style.box}>{data.HireDate}</Typography>
          </Grid>
          {data.assigned && data.assigned.length ? (
            <Grid md={4} item style={{ padding: "10px" }}>
              <Typography style={{ fontSize: "14px" }}>Assigned</Typography>

              <Typography style={style.box}>
                {data.assigned.map((item, index) => (
                  <span>{item}, </span>
                ))}
              </Typography>
            </Grid>
          ) : null}
        </Grid>
      </Paper>
    </Grid>
  );
};
