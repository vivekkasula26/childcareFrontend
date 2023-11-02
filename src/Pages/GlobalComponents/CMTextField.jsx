import { TextField } from "@mui/material";
import React from "react";

export const CMTextField = ({ sx, ...props }) => {
  return (
    <TextField
      color="primary"
      size="small"
      fullWidth={true}
      sx={[sx, { "& input": { padding: 1 } }]}
      {...props}
    />
  );
};
