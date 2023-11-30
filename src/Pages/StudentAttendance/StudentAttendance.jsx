import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  Button,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import axios from "axios";
import { API_URLS } from "../GlobalFunctions/APIs";
import { CMTextField } from "../GlobalComponents/CMTextField";
import Checkbox from "@mui/material/Checkbox";

import MuiAlert from "@mui/material/Alert";

export const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const StudentAttendance = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setMessage("");
  };

  useEffect(() => {
    axios
      .get(API_URLS.GET_ASSIGNED_ENROLLED_CHILDREN, HEADER_CONFIG)
      .then(({ data }) => {
        setData(data);
      });
  }, [refresh]);

  const signInchild = (id, signIn = true) => {
    let payload = {
      id: id,
    };
    let api = signIn ? API_URLS.MARK_CHILD_LOGIN : API_URLS.MARK_CHILD_LOGOUT;

    axios.post(api, payload, HEADER_CONFIG).then(({ data }) => {
      setRefresh(refresh + 1);
      setMessage(data.message);
      handleClick();
    });
  };

  return (
    <Grid>
      <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
        Student Attendance
      </Typography>

      <TableContainer style={{ border: "1px solid ", borderColor: "#e6e6e6" }}>
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
              <TableCell>EnrollmentID</TableCell>
              <TableCell align="center">Child Firstname</TableCell>
              <TableCell align="center">Child Lastname</TableCell>
              <TableCell align="center">DOB</TableCell>
              <TableCell align="center">Age Group</TableCell>
              <TableCell align="center">Sign in</TableCell>
              <TableCell align="center">Sign out</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
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
                  {row.EnrollmentID}
                </TableCell>
                <TableCell align="center">{row.ChildFirstName}</TableCell>
                <TableCell align="center">{row.ChildLastName}</TableCell>
                <TableCell align="center">{row.ChildDateOfBirth}</TableCell>
                <TableCell align="center">{row.AgeGroup}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    size="small"
                    onClick={() => signInchild(row.EnrollmentID)}
                    checked={row.SignInTime}
                    disabled={row.SignInTime}
                    sx={{
                      padding: "0px",
                      "&.Mui-disabled": {
                        color: "#4d6b53",
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    size="small"
                    onClick={() => signInchild(row.EnrollmentID, false)}
                    checked={row.SignOutTime}
                    disabled={!row.SignInTime || row.SignOutTime}
                    sx={{
                      padding: "0px",
                      "&.Mui-disabled":
                        row.SignInTime && row.SignOutTime
                          ? {
                              color: "#4d6b53",
                            }
                          : null,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
