import { Grid, Typography, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";

export const ManageClassroom = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState([]);
  const [newValues, setNewValues] = useState({});
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);

  useEffect(() => {
    axios.get(API_URLS.GET_CLASSROOM_ENROLLMENTS, HEADER_CONFIG).then((res) => {
      let response = res.data;
      console.log(response);
      setData(response);
    });
  }, []);

  const styles = {
    tableCell: {
      borderRight: "1px solid",
      fontSize: "12px",
      padding: "10px",
      borderColor: "#e6e6e6",
      padding: "10px",
      width: "100px",
      textAlign: "center",
    },
    tableRow: {
      flexFlow: "row",
      alignItems: "center",
      display: "flex",
      border: "1px solid lightgray",
      fontSize: "12px",
      borderColor: "#e6e6e6",
      width: "fit-content",
    },
  };

  return (
    <Grid>
      <Grid container md={8} item>
        <Typography
          style={{
            fontSize: 28,
            fontWeight: "bold",
            fontFamily: "sans-serif",
            marginBottom: "20px",
          }}
        >
          Manage Class Enrollments
        </Typography>
      </Grid>

      {data.length ? (
        <>
          <Grid sx={styles.tableRow} style={{ backgroundColor: "#e1e2e48f" }}>
            <Typography sx={styles.tableCell}>ID</Typography>
            <Typography sx={styles.tableCell}>Classname</Typography>
            <Typography sx={styles.tableCell}>Capacity</Typography>
            <Typography sx={styles.tableCell}>Fees</Typography>
            <Typography sx={styles.tableCell}>Occupied</Typography>
          </Grid>
          {data.map((item, index) => (
            <Grid sx={styles.tableRow} style={{ backgroundColor: "#fafafd" }}>
              <Typography sx={styles.tableCell}>{item.ClassroomID}</Typography>
              <Typography sx={styles.tableCell}>{item.ClassName}</Typography>
              <Typography sx={styles.tableCell}>{item.Capacity}</Typography>
              <Typography sx={styles.tableCell}>{item.fees}$/week</Typography>
              <Typography sx={styles.tableCell}>{item.Occupied}</Typography>
            </Grid>
          ))}
        </>
      ) : (
        <></>
      )}

      {data.length && !isDisabled ? (
        <Button
          variant="contained"
          style={{ marginTop: 20, marginBottom: 20 }}
          onClick={() => setIsDisabled(false)}
        >
          Submit the changes
        </Button>
      ) : null}
    </Grid>
  );
};
