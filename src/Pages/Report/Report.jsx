import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";

export const Report = () => {
  const [selected, setSelected] = useState("Infant");
  const [childData, setChildData] = useState([]);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const [selectedAttendance, setSelectedAttendance] = useState("Present");
  const isPresent = selectedAttendance == "Present";

  useEffect(() => {
    axios
      .get(
        API_URLS.GET_CHILD_ATTENDANCE +
          `?ageGroup=${selected}&isPresent=${isPresent}`,
        HEADER_CONFIG
      )
      .then(({ data }) => {
        console.log(data.data);
        setChildData(data.data);
      });
  }, [selected, isPresent]);

  const handleSelection = (event) => {
    setSelected(event.target.value);
  };

  return (
    <Grid>
      <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
        Attendance Report
      </Typography>
      <Grid sx={{ display: "flex", flexFlow: "column" }}>
        <ToggleButtonGroup
          value={selected}
          exclusive
          onChange={handleSelection}
          size="small"
          color="primary"
          variant="contained"
        >
          <ToggleButton value="Infant">Infant</ToggleButton>
          <ToggleButton value="Toddler">Toddler</ToggleButton>
          <ToggleButton value="Twaddler">Twaddler</ToggleButton>
          <ToggleButton value="3 Years Old">3 Years Old</ToggleButton>
          <ToggleButton value="4 Years Old">4 Years Old</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={selectedAttendance}
          exclusive
          onChange={(event) => setSelectedAttendance(event.target.value)}
          size="small"
          color="primary"
          variant="contained"
          sx={{ mt: "10px" }}
        >
          <ToggleButton value={"Present"}>Present</ToggleButton>
          <ToggleButton value={"Absent"}>Absent</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <TableContainer
        style={{ border: "1px solid ", borderColor: "#e6e6e6", marginTop: 20 }}
      >
        <Table
          sx={{ minWidth: 650, backgroundColor: "#fafafd" }}
          aria-label="simple table"
        >
          <TableHead sx={{ backgroundColor: "#e1e2e48f" }}>
            <TableRow
              sx={{
                "& .MuiTableCell-root": {
                  borderRight: "1px solid lightgray",
                  fontSize: "12px",
                  padding: "10px",
                  borderColor: "#e6e6e6",
                },
              }}
            >
              <TableCell>child ID</TableCell>
              <TableCell align="center">Firstname</TableCell>
              <TableCell align="center">Lastname</TableCell>
              <TableCell align="center">
                {isPresent ? "Date" : "Absent Date"}
              </TableCell>
              {isPresent ? (
                <>
                  <TableCell align="center">SignInTime</TableCell>
                  <TableCell align="center">SignOutTime</TableCell>
                </>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {childData.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{
                  "& .MuiTableCell-root": {
                    borderRight: "1px solid",
                    fontSize: "12px",
                    padding: "10px",
                    borderColor: "#e6e6e6",
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {row.childID}
                </TableCell>
                <TableCell align="center">{row.FirstName}</TableCell>
                <TableCell align="center">{row.LastName}</TableCell>
                <TableCell align="center">
                  {isPresent ? row.date : row.AbsentDate}
                </TableCell>
                {isPresent ? (
                  <>
                    <TableCell align="center">{row.SignInTime}</TableCell>
                    <TableCell align="center">{row.SignOutTime}</TableCell>
                  </>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
