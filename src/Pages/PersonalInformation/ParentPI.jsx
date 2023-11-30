import { Grid, Paper, Typography } from "@mui/material";
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

export const ParentPI = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    let api = API_URLS.GET_ENROLLED_CHILDREN + `?email=${user.email}`;

    axios.get(api, HEADER_CONFIG).then(({ data }) => {
      dispatch(loginUser({ ...user, ...data }));
      setData(data);
    });
  }, []);

  const PI = ({ value, name, disabled, ...props }) => {
    return (
      <Grid md={4} item style={{ padding: "10px" }}>
        <CMTextField
          label={name}
          defaultValue={value}
          variant="standard"
          InputProps={{
            readOnly: disabled,
          }}
          {...props}
        />
      </Grid>
    );
  };

  return (
    <Grid>
      <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
        Personal Information
      </Typography>
      <Paper elevation={4} style={{ marginTop: "20px", paddingTop: "15px" }}>
        <Typography
          style={{ fontSize: 20, fontWeight: "bold", padding: "10px" }}
        >
          Child Information
        </Typography>
        <Grid
          container
          display={"flex"}
          flexDirection={"row"}
          md={12}
          sx={{ pb: "15px" }}
        >
          <PI name={"ID"} value={data.ChildID} disabled={true} />
          <PI
            name={"Enrollment Date"}
            value={data.enrollmentDate}
            disabled={true}
          />
          <PI
            name={"Date Of Birth"}
            value={data.ChildDateOfBirth}
            disabled={true}
          />
          <PI name={"Firstname"} value={data.ChildFirstName} />
          <PI name={"Lastname"} value={data.ChildLastName} />
          <PI name={"AgeGroup"} value={data.AgeGroup} disabled={true} />
          <PI name={"Allergies"} value={data.Allergies} />
        </Grid>
        <Typography
          style={{ fontSize: 20, fontWeight: "bold", padding: "10px" }}
        >
          Parent Information
        </Typography>
        <Grid
          container
          display={"flex"}
          flexDirection={"row"}
          md={12}
          sx={{ pb: "15px" }}
        >
          <PI name={"Firstname"} value={data.ParentFirstName} />
          <PI name={"Lastname"} value={data.ParentLastName} />
          <PI name={"email"} value={user.email} />
          <PI name={"Phonenumber"} value={data.PhoneNumber} />
          <PI name={"Address"} value={data.Address} />
        </Grid>
      </Paper>
    </Grid>
  );
};
