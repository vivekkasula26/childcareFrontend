import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";

export const AccountingLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const isParent = user.roles && user.roles.includes("Parent");

  useEffect(() => {
    axios
      .get(
        API_URLS.GET_STUDENT_LEDGER + (isParent ? `?id=${user.ChildID}` : ""),
        HEADER_CONFIG
      )
      .then(({ data }) => {
        setLedgerData(data);
      });
  }, []);

  return (
    <Grid>
      <Grid container md={8} item>
        <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
          Student Ledger
        </Typography>
      </Grid>
      <TableContainer
        style={{
          border: "1px solid ",
          borderColor: "#e6e6e6",
          marginTop: "20px",
        }}
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
              <TableCell align="center">Child ID</TableCell>
              <TableCell align="center">Firstname</TableCell>
              <TableCell align="center">Lastname</TableCell>
              <TableCell align="center">Parent Name</TableCell>
              <TableCell align="center">PhoneNumber</TableCell>
              <TableCell align="center">Balance</TableCell>
              <TableCell align="center">Generated Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ledgerData.map((row, index) => (
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
                <TableCell align="center" scope="row">
                  {row.ChildID}
                </TableCell>
                <TableCell align="center">{row.ChildFirstName}</TableCell>
                <TableCell align="center">{row.ChildLastName}</TableCell>
                <TableCell align="center">
                  {row.ParentFirstName} {row.ParentLastName}
                </TableCell>
                <TableCell align="center">{row.PhoneNumber}</TableCell>
                <TableCell align="center">
                  {row.balance ? `$${row.balance}` : "Pending"}
                </TableCell>
                <TableCell align="center">
                  {row.GeneratedDate || "Pending"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
