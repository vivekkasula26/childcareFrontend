import { Grid, Typography, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { HEADER_CONFIG } from "../GlobalFunctions/API_header_config";
import { CMTextField } from "../GlobalComponents/CMTextField";

export const ManageClassroom = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState([]);
  const [newValues, setNewValues] = useState({});

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
          }}
        >
          Manage Class Enrollments
        </Typography>
      </Grid>
      <Button
        variant="outlined"
        style={{ marginTop: 20, marginBottom: 20 }}
        onClick={() => setIsDisabled(!isDisabled)}
      >
        {!isDisabled ? "cancel" : "edit"}
      </Button>
      {data.length ? (
        <>
          <Grid sx={styles.tableRow} style={{ backgroundColor: "#e1e2e48f" }}>
            <Typography sx={styles.tableCell}>ID</Typography>
            <Typography sx={styles.tableCell}>Classname</Typography>
            <Typography sx={styles.tableCell}>Capacity</Typography>
          </Grid>
          {data.map((item, index) => (
            <Grid sx={styles.tableRow} style={{ backgroundColor: "#fafafd" }}>
              <Typography sx={styles.tableCell}>{item.ClassroomID}</Typography>
              <Typography sx={styles.tableCell}>{item.ClassName}</Typography>
              <CMTextField
                value={item.Capacity}
                variant="standard"
                fullWidth={false}
                style={{ width: "121px" }}
                disabled={isDisabled}
                onChange={(event) => {
                  let new_data = {};
                  let n_d = data;
                  let val = event.target.value;
                  n_d[index]["Capacity"] = val;
                  new_data["id"] = val;
                  new_data["capacity"] = val;
                  setNewValues(data);
                  setData([...n_d]);
                }}
              />
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
