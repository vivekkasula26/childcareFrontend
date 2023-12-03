import React, { useEffect, useState } from "react";
import {
  Button,
  ClickAwayListener,
  Dialog,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  Snackbar,
} from "@mui/material";
import { Form, Field } from "react-final-form";
import { CMTextField } from "../GlobalComponents/CMTextField";
import { API_URLS } from "../GlobalFunctions/APIs";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import axios from "axios";
import { CMDatePicker, formatPhoneNumber } from "../EnrollChild/EnrollChild";
import { validateEmail } from "../Homepage/CreateAccount";
import { Alert } from "../StudentAttendance/StudentAttendance";

export const ManageStaff = () => {
  const [hiredStaff, setHiredStaff] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isClikedSearch, setIsClikedSearch] = useState(false);
  const [staffID, setStaffID] = useState("");
  const [isManageStaff, setIsManageStaff] = useState(false);
  const [editedAssigned, setEditedAssigned] = useState([]);
  const [availableSpots, setAvailableSpots] = useState({});
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(0);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setMessage("");
  };

  const styles = {
    heading: {
      fontSize: "25px",
      fontWeight: 400,
      mt: "15px",
      mb: "7px",
      fontFamily: "sans-serif",
      fontWeight: "bold",
    },
    conatiner: {
      padding: "15px",
      "& .MuiFormControl-root": {
        marginBottom: "10px" /* Adjust the margin as needed */,
      },
    },
  };

  useEffect(() => {
    getData();
    getAvailableSpots();
  }, [refresh]);

  const getData = () => {
    axios.get(API_URLS.GET_HIRED_STAFF, HEADER_CONFIG).then((response) => {
      let data = response.data;
      setHiredStaff(data);
    });
  };

  const onSubmit = (values) => {
    const payload = {
      FirstName: values.FirstName,
      LastName: values.LastName,
      dob: `${values.dob.$y}-${values.dob.$M + 1}-${values.dob.$D}`,
      HourlySalary: values.HourlySalary,
      PhoneNumber: values.PhoneNumber,
      Address: values.Address,
      email: values.email,
      assigned: editedAssigned,
    };

    axios.post(API_URLS.HIRE_STAFF, payload, HEADER_CONFIG).then(({ data }) => {
      setIsOpen(false);
      setRefresh(refresh + 1);
      setMessage(data.message);
    });
  };

  const validate = (values) => {
    const errors = {};

    if (!values) {
      return errors;
    }

    if (!values.FirstName) {
      errors.FirstName = "Required";
    }
    if (!values.LastName) {
      errors.LastName = "Required";
    }
    if (!values.dob) {
      errors.dob = "Required";
    }
    if (!values.PhoneNumber) {
      errors.PhoneNumber = "Required";
    } else if (!/^\d{10}$/.test(values.PhoneNumber)) {
      errors.PhoneNumber = "Invalid phone number (10 digits)";
    }
    if (!values.Address) {
      errors.Address = "Required";
    }
    if (!values.HourlySalary) {
      errors.HourlySalary = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (!validateEmail(values.email)) {
      errors.email = "Invalid email address";
    }
    setErrors(errors);
  };

  const withdrawStaff = () => {
    let payload = {
      ID: staffID,
    };
    axios.post(API_URLS.WITHDRAW_STAFF, payload, HEADER_CONFIG).then((res) => {
      let data = res.data;
      setIsWithdrawalOpen(false);
      setRefresh(refresh + 1);
      closeDialog();
      setMessage(data.message);
    });
  };

  const handleAgeGroupChange = (item, data) => {
    if (availableSpots[item] || data.includes(item)) {
      if (data.includes(item)) {
        if (data.length > 1 || isOpen) {
          let index = data.indexOf(item);
          if (index > -1) {
            data.splice(index, 1);
            manageStaff(data);
          }
        } else {
          setMessage("Can not leave staff unassigned");
        }
      } else {
        let val = [...data, item];
        manageStaff(val);
      }
    } else {
      setMessage("Please follow Teacher Assignment rules");
    }
  };

  const closeDialog = () => {
    setIsManageStaff(false);
    setIsWithdrawalOpen(false);
    setIsClikedSearch(false);
    setEditedAssigned([]);
    setIsOpen(false);
    setStaffID("");
    setErrors({});
  };

  const manageStaff = (val) => {
    if (isOpen) {
      setEditedAssigned([...val]);
      return;
    }

    const payload = {
      id: staffID,
      assigned: val,
    };

    // return;
    axios
      .post(API_URLS.UPDATE_STAFF, payload, HEADER_CONFIG)
      .then(({ data }) => {
        setMessage(data.message);
        setRefresh(refresh + 1);
      });
  };

  const getAvailableSpots = () => {
    axios
      .get(API_URLS.GET_AVALIABLE_CLASSROOM_SPOTS, HEADER_CONFIG)
      .then(({ data }) => {
        setAvailableSpots(data);
      });
  };

  const ClassroomDropdown = ({ assigned = [] }) => {
    const ass = editedAssigned.length > 0 ? editedAssigned : assigned;

    const classes = [
      "Infant",
      "Toddler",
      "Twaddler",
      "3 Years Old",
      "4 Years Old",
    ];

    return (
      <Grid>
        <Typography>
          Assigned Classroom:{isOpen ? "(Optional)" : ""}{" "}
        </Typography>

        <Grid sx={{ display: "flex", flexWrap: "wrap" }}>
          {classes.map((item, index) => (
            <Grid
              sx={{ display: "flex", flexFlow: "row", alignItems: "center" }}
            >
              <Checkbox
                size={"small"}
                checked={ass.includes(item)}
                onClick={() => handleAgeGroupChange(item, ass)}
              />
              <Typography>{item}</Typography>
            </Grid>
          ))}
        </Grid>
        {/* <Select
          labelId="ageGroup-label"
          id="ageGroup"
          multiple
          value={editedAssigned.length > 0 ? editedAssigned : assigned}
          onChange={(event) =>
            handleAgeGroupChange(
              event,
              editedAssigned.length > 0 ? editedAssigned : assigned
            )
          }
          sx={{ width: "200px" }}
          size="small"
          variant="outlined"
        >
          <MenuItem value="Infant">Infant</MenuItem>
          <MenuItem value="Toddler">Toddler</MenuItem>
          <MenuItem value="Twaddler">Twaddler</MenuItem>
          <MenuItem value="3 Years Old">3 Years Old</MenuItem>
          <MenuItem value="4 Years Old">4 Years Old</MenuItem>
        </Select> */}
      </Grid>
    );
  };

  const sendInvite = (id) => {
    let payload = {
      id: id,
    };
    axios
      .post(API_URLS.INVITE_STAFF, payload, HEADER_CONFIG)
      .then(({ data }) => {
        setRefresh(refresh + 1);
        setMessage(data.message);
      });
  };

  return (
    <Grid>
      <Grid container md={8} item>
        <Typography
          style={{ fontSize: 28, fontWeight: "bold", fontFamily: "sans-serif" }}
        >
          Assign Staff
        </Typography>
      </Grid>
      <Button
        variant="outlined"
        style={{ marginTop: 20, marginBottom: 20 }}
        onClick={() => setIsOpen(true)}
      >
        Hire Staff
      </Button>
      <Button
        variant="outlined"
        style={{ marginTop: 20, marginBottom: 20, marginLeft: "15px" }}
        onClick={() => setIsWithdrawalOpen(true)}
      >
        Withdraw Staff
      </Button>
      <Button
        variant="outlined"
        style={{ marginTop: 20, marginBottom: 20, marginLeft: "15px" }}
        onClick={() => setIsManageStaff(true)}
      >
        Assign Staff
      </Button>
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
              <TableCell>Staff ID</TableCell>
              <TableCell align="center">Firstname</TableCell>
              <TableCell align="center">Lastname</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">PhoneNumber</TableCell>
              <TableCell align="center">HourlySalary</TableCell>
              <TableCell align="center">HireDate</TableCell>
              <TableCell align="center">Invite</TableCell>
              <TableCell align="center">Assigned Classrooms</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hiredStaff.map((row, index) => (
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
                  {row.ID}
                </TableCell>
                <TableCell align="center">{row.FirstName}</TableCell>
                <TableCell align="center">{row.LastName}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.Address}</TableCell>
                <TableCell align="center">{row.PhoneNumber}</TableCell>
                <TableCell align="center">{row.HourlySalary}</TableCell>
                <TableCell align="center">{row.HireDate}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={row.invite}
                    size="small"
                    onClick={() => sendInvite(row.ID)}
                    disabled={row.invite}
                    sx={{
                      padding: "0px",
                      "&.Mui-disabled": {
                        color: "#4d6b53",
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="center">{row.assigned.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={isOpen} onClose={closeDialog}>
        <Grid sx={styles.conatiner}>
          <Form
            style={{ marginBottom: "10px" }}
            onSubmit={onSubmit}
            render={({ handleSubmit, values }) => (
              <form
                onSubmit={handleSubmit}
                className={styles.form}
                onChange={() => {
                  for (const key in errors) {
                    errors[key] = "";
                  }
                  setData(values);
                }}
              >
                <div>
                  <Typography sx={styles.heading}>Staff Details</Typography>
                  <Field
                    name="FirstName"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="First Name"
                        error={errors.FirstName}
                        helperText={errors.FirstName}
                      />
                    )}
                  />
                  <Field
                    name="LastName"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Last Name"
                        error={errors.LastName}
                        helperText={errors.LastName}
                      />
                    )}
                  />
                  <Field
                    name="Address"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Address"
                        error={errors.Address}
                        helperText={errors.Address}
                      />
                    )}
                  />
                  <Field
                    name="email"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Email"
                        error={errors.email}
                        helperText={errors.email}
                        sx={{ marginBottom: "15px" }}
                      />
                    )}
                  />
                  <Field
                    name="PhoneNumber"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Phone Number"
                        type="tel"
                        error={errors.PhoneNumber}
                        helperText={errors.PhoneNumber}
                      />
                    )}
                    format={formatPhoneNumber}
                    parse={(value) => value.replace(/[^\d]/g, "").slice(0, 10)}
                  />
                  <Field
                    name="HourlySalary"
                    render={({ input }) => (
                      <CMTextField
                        {...input}
                        label="Hourly Salary"
                        error={errors.HourlySalary}
                        helperText={errors.HourlySalary}
                      />
                    )}
                    parse={(value) => value.replace(/[^\d]/g, "")}
                  />
                  <Field
                    name="dob"
                    render={({ input }) => (
                      <CMDatePicker
                        {...input}
                        label={"Date of Birth"}
                        error={errors.dob}
                        helperText={errors.dob}
                      />
                    )}
                  />
                  <ClassroomDropdown />
                </div>
                <Button
                  variant="contained"
                  style={{ marginTop: 10, width: "30%" }}
                  onClick={() => {
                    validate(values);
                    handleSubmit();
                  }}
                >
                  Submit
                </Button>
              </form>
            )}
          />
        </Grid>
      </Dialog>

      <Dialog
        open={isManageStaff || isWithdrawalOpen}
        onClose={closeDialog}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <Grid sx={{ padding: "15px" }}>
          <Typography sx={styles.heading}>
            {isManageStaff ? "Assign Staff" : "Withdraw Staff"}
          </Typography>
          {isClikedSearch ? (
            <>
              {hiredStaff.map((item, index) => {
                return item.ID == staffID ? (
                  <Grid>
                    <Typography>Staff ID: {item.ID}</Typography>
                    <Typography>Hire Date: {item.HireDate}</Typography>
                    <Typography>Firstname: {item.FirstName}</Typography>
                    <Typography>Lastname: {item.LastName}</Typography>
                    <Typography>DOB: {item.DOB}</Typography>
                    <Typography>Hourly Salary : {item.HourlySalary}</Typography>
                    <Typography>PhoneNumber: {item.PhoneNumber}</Typography>
                    <Typography>Address: {item.Address}</Typography>
                    {isManageStaff ? (
                      <ClassroomDropdown assigned={item.assigned} />
                    ) : (
                      <Typography>
                        Assigned Classroom: {item.assigned.join(",")}
                      </Typography>
                    )}
                  </Grid>
                ) : (
                  <></>
                );
              })}
            </>
          ) : (
            <CMTextField
              placeholder="Enter ID"
              label="Enter ID"
              onChange={(event) => setStaffID(event.target.value)}
            />
          )}
          {isClikedSearch && isWithdrawalOpen ? (
            <Typography sx={{ marginY: "10px" }}>
              Check the details and confirm
            </Typography>
          ) : null}
          {isClikedSearch && isManageStaff ? null : (
            <Button
              variant="contained"
              sx={{ mt: "20px" }}
              onClick={() =>
                isClikedSearch
                  ? isManageStaff
                    ? manageStaff()
                    : withdrawStaff()
                  : setIsClikedSearch(true)
              }
            >
              {isClikedSearch ? "Submit" : "Search"}
            </Button>
          )}
        </Grid>
      </Dialog>
      <Snackbar open={message} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} sx={{ width: "100%" }} severity="info">
          {message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
