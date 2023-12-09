import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { useSelector } from "react-redux";
import {
  Button,
  ButtonGroup,
  Dialog,
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

export const StaffAttendance = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const [StaffAttendance, setStaffAttendance] = useState([]);
  const isParent = user.role && user.role == "Parent";
  const isTeacher = user.role && user.role == "Teacher";
  const isAdmin = user.role && user.role == "Admin";
  const [selected, setSelected] = useState(isParent ? "child" : "Staff");
  const [childrenList, setChildrenList] = useState([]);
  const isStaff = selected == "Staff";

  useEffect(() => {
    if (isParent) {
      getChildAttendance();
      return;
    }
    if (user.email && !isParent) {
      axios
        .get(
          !isTeacher
            ? API_URLS.GET_STAFF_ATTENDANCE
            : API_URLS.GET_STAFF_ATTENDANCE_BY_ID + `/${user.email}`,
          HEADER_CONFIG
        )
        .then(({ data }) => {
          if (typeof data.data != "undefined") {
            setStaffAttendance(data.data);
          }
        });
    }
  }, []);

  const getChildAttendance = () => {
    axios
      .get(
        API_URLS.GET_CHILD_ATTENDANCE +
          `?isPresent=${true}` +
          `${isParent && `&childID=${user.ChildID}`}`,
        HEADER_CONFIG
      )
      .then(({ data }) => {
        setChildrenList(data.data);
        setSelected("Child");
      });
  };

  const handleSelection = (param) => {
    if (param.target.value == "Child") {
      getChildAttendance();
      return;
    }
    setSelected(param.target.value);
  };

  return (
    <Grid>
      <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
        {isTeacher
          ? "Staff attendance and accounts"
          : isAdmin
          ? "Staff attendance "
          : "Child attendance"}
      </Typography>

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
              <TableCell>{isStaff ? "Staff ID" : "child ID"}</TableCell>
              <TableCell align="center">Firstname</TableCell>
              <TableCell align="center">Lastname</TableCell>
              <TableCell align="center">{isStaff ? "Week" : "Date"}</TableCell>
              <TableCell align="center">
                {isStaff ? "Hours Worked" : "ageGroup"}
              </TableCell>
              <TableCell align="center">
                {isStaff ? "Hourly Salary" : "SignInTime"}
              </TableCell>
              <TableCell align="center">
                {isStaff ? "AmountEarned" : "SignOutTime"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(isStaff ? StaffAttendance : childrenList).map((row, index) => (
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
                  {isStaff ? row.StaffID : row.childID}
                </TableCell>
                <TableCell align="center">{row.FirstName}</TableCell>
                <TableCell align="center">{row.LastName}</TableCell>
                <TableCell align="center">
                  {isStaff
                    ? `${row.FirstDateOfWeek} - ${row.LastDateOfWeek}`
                    : row.date}
                </TableCell>
                <TableCell align="center">
                  {isStaff ? `${row.HoursWorked} hr` : row.ageGroup}
                </TableCell>
                <TableCell align="center">
                  {isStaff ? `$${row.HourlySalary}/hr` : row.SignInTime}
                </TableCell>
                <TableCell align="center">
                  {isStaff ? `$${row.AmountEarned}` : row.SignOutTime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
