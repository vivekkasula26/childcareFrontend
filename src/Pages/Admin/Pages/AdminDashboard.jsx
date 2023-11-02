import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { CMTextField } from "../../GlobalComponents/CMTextField";
import { Form, Field } from "react-final-form";

export const AdminDashboard = () => {
  const onSubmit = () => {};

  const validate = () => {};

  const styles = {
    heading: {
      fontSize: "25px",
      fontWeight: 400,
      mt: "15px",
      mb: "7px",
    },
    conatiner: {
      "& .MuiFormControl-root": {
        marginBottom: "10px" /* Adjust the margin as needed */,
      },
    },
  };

  return (
    <>
      <Grid sx={styles.conatiner} container md={8} item>
        <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
          Create an Account for a Facility
        </Typography>
        <Form
          style={{ marginBottom: "10px" }}
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <Typography sx={styles.heading}>Facility Details</Typography>
                <Field
                  name="facilityName"
                  label="Facility Name"
                  component={CMTextField}
                />
                <Field name="Address" label="Address" component={CMTextField} />
                <Field
                  name="facilityPhonenumber"
                  label="Phone number"
                  component={CMTextField}
                />
                <Field
                  name="licenseNumber"
                  label="License number"
                  component={CMTextField}
                />
              </div>
              <div>
                <Typography sx={styles.heading}>
                  Facility Admin Details
                </Typography>
                <Field
                  name="adminFirstName"
                  label="Firstname"
                  component={CMTextField}
                />
                <Field
                  name="adminLastName"
                  label="Lastname"
                  component={CMTextField}
                />
                <Field name="email" label="Email" component={CMTextField} />
                <Field
                  name="phonenumber"
                  label="Phonnumber"
                  component={CMTextField}
                />
              </div>
              <Button
                variant="contained"
                style={{ marginTop: 10, width: "30%" }}
              >
                Submit
              </Button>
            </form>
          )}
        />
      </Grid>
    </>
  );
};
