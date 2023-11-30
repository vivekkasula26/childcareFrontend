import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URLS } from "../GlobalFunctions/APIs";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";

export const LedgerReport = () => {
  const [ledger, setLedger] = useState([]);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);

  useEffect(() => {
    axios.get(API_URLS.GET_LEDGER_REPORT, HEADER_CONFIG).then(({ data }) => {
      setLedger(data);
    });
  }, []);

  return (
    <Grid>
      <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
        Ledger Report
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
              <TableCell>WeekStart </TableCell>
              <TableCell align="center">WeekEnd</TableCell>
              <TableCell align="center">Total Billed</TableCell>
              <TableCell align="center">Total Earned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ledger.map((row, index) => (
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
                  {row.WeekStart}
                </TableCell>
                <TableCell align="center">{row.WeekEnd}</TableCell>
                <TableCell align="center">$ {row.TotalBilled}</TableCell>
                <TableCell align="center">$ {row.TotalEarned}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
