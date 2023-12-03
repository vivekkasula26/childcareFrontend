import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  Grid,
  Snackbar,
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
import { Form, Field } from "react-final-form";
import { CMTextField } from "../GlobalComponents/CMTextField";
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl, FormHelperText } from "@mui/material";
import axios from "axios";
import { API_URLS } from "../GlobalFunctions/APIs";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/userSlice";
import { Alert } from "../StudentAttendance/StudentAttendance";
import { validateEmail } from "../Homepage/CreateAccount";

export const CMDatePicker = ({
  label,
  error,
  helperText,
  format = "MM-DD-YYYY",
  ...props
}) => {
  return (
    <FormControl error={true}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          sx={{
            "& input": { padding: "13px 14px" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: error && "#d32f2f",
            },
          }}
          label={label}
          {...props}
          format={format}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </LocalizationProvider>
    </FormControl>
  );
};
export const formatPhoneNumber = (value) => {
  if (typeof value !== "undefined") {
    return value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
};

export const EnrollChild = () => {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [childrenList, setChildrenList] = useState([]);
  const [waitChildrenList, setWaitChildrenList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isClikedSearch, setIsClikedSearch] = useState(false);
  const [EnrollmentID, setEnrollmentID] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [sendToWaitingList, setSendToWaitingList] = useState(false);
  const [payloadData, setPayloadData] = useState({});
  const [selected, setSelected] = useState("enrolled");
  const [selectedChildData, setselectedChildData] = useState({});
  const [isMoveChildDialog, setIsMoveChildDialog] = useState(false);
  const isWaitlist = selected == "waitlist";
  const consent =
    "I consent to enroll my child in the educational program. I acknowledge receiving and understanding the program policies.";
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const HEADER_CONFIG = getHeaderConfig(user);
  const [isInvite, setIsInvite] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setMessage("");
  };

  useEffect(() => {
    console.log(HEADER_CONFIG);
    axios.get(API_URLS.GET_ENROLLED_CHILDREN, HEADER_CONFIG).then((res) => {
      let response = res.data;
      setChildrenList(response);
    });
  }, [user.email, refresh]);

  const withdrawChild = () => {
    let payload = {
      enrollmentID: EnrollmentID,
      isWaitlist: isWaitlist,
    };

    axios.post(API_URLS.WITHDRAW_CHILD, payload, HEADER_CONFIG).then((res) => {
      let data = res.data;
      setIsWithdrawalOpen(false);
      let updated_data = [];
      (isWaitlist ? waitChildrenList : childrenList).map((item, index) => {
        console.log((isWaitlist ? item.ID : item.EnrollmentID) != EnrollmentID);
        if ((isWaitlist ? item.ID : item.EnrollmentID) != EnrollmentID) {
          updated_data.push(item);
        }
      });
      if (isWaitlist) {
        setWaitChildrenList(updated_data);
      } else {
        setChildrenList(updated_data);
      }
      setIsClikedSearch(false);
      setMessage(data.message);
    });
  };

  const sendInvite = (id) => {
    let payload = {
      id: id,
    };
    axios
      .post(API_URLS.INVITE_PARENT, payload, HEADER_CONFIG)
      .then(({ data }) => {
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
    if (!values.Allergies) {
      errors.Allergies = "Required";
    }
    if (!values.consentForm) {
      errors.consentForm = "Required";
    }
    if (!values.dob) {
      errors.dob = "Required";
    }

    if (!values.ParentFirstName) {
      errors.ParentFirstName = "Required";
    }
    if (!values.ParentLastName) {
      errors.ParentLastName = "Required";
    }
    if (!values.PhoneNumber) {
      errors.PhoneNumber = "Required";
    } else if (!/^\d{10}$/.test(values.PhoneNumber)) {
      errors.PhoneNumber = "Invalid phone number (10 digits)";
    }
    if (!values.Address) {
      errors.Address = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (!validateEmail(values.email)) {
      errors.email = "Invalid email address";
    }

    setErrors(errors);
  };

  const closeEnrollForm = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSendToWaitingList(false);
    }, 500);
  };

  const addToWaitList = () => {
    axios
      .post(API_URLS.ENROLL_CHILD_TO_WAITLIST, payloadData, HEADER_CONFIG)
      .then(({ data }) => {
        closeEnrollForm();
        setMessage(data.message);
      });
  };

  const onSubmit = (values) => {
    const payload = {
      FirstName: isMoveChildDialog ? values.FirstName : values.FirstName,
      LastName: isMoveChildDialog ? values.LastName : values.LastName,
      dob: isMoveChildDialog
        ? new Date(values.ChildDateOfBirth).toISOString().split("T")[0]
        : `${values.dob.$y}-${values.dob.$M + 1}-${values.dob.$D}`,
      Allergies: values.Allergies,
      ParentFirstName: values.ParentFirstName,
      ParentLastName: values.ParentLastName,
      PhoneNumber: values.PhoneNumber,
      Address: values.Address,
      waitlistID: isMoveChildDialog ? values.ID : "",
      consentForm: values.consentForm || consent,
      email: values.email,
    };

    setPayloadData(payload);

    axios
      .post(API_URLS.ENROLL_CHILD, payload, HEADER_CONFIG)
      .then(({ data }) => {
        if (data.success) {
          setPayloadData({});
          closeEnrollForm();
          setIsMoveChildDialog(false);
          setMessage(data.message);
          setRefresh(refresh + 1);
          if (isMoveChildDialog) {
            getWaitlist();
          }
        } else if (isMoveChildDialog) {
          setMessage(data.message);
          setPayloadData({});
        } else {
          setSendToWaitingList(true);
        }
      });
  };

  const getWaitlist = () => {
    axios.get(API_URLS.GET_WAIT_CHILD_LIST, HEADER_CONFIG).then(({ data }) => {
      setSelected("waitlist");
      setWaitChildrenList(data);
    });
  };

  const handleSelection = (param) => {
    if (param.target.value == "waitlist") {
      getWaitlist();
      return;
    }
    setSelected(param.target.value);
  };

  const styles = {
    conatiner: {
      padding: "10px",
      "& .MuiFormControl-root": {
        marginBottom: "10px",
      },
    },
    heading: {
      fontSize: "20px",
      fontWeight: "bold",
      mt: "15px",
      mb: "7px",
    },
  };

  const searchData = () => {
    setselectedChildData({});
    (isWaitlist ? waitChildrenList : childrenList).map((item, index) => {
      if ((isWaitlist ? item.ID : item.EnrollmentID) == EnrollmentID) {
        setselectedChildData(item);
      }
      setIsClikedSearch(true);
    });
  };

  return (
    <Grid>
      <Grid container md={8} item>
        <Typography style={{ fontSize: 28, fontWeight: "bold" }}>
          Child Enrollment
        </Typography>
      </Grid>
      <Button
        variant="outlined"
        style={{ marginTop: 20, marginBottom: 20 }}
        onClick={() => setIsOpen(true)}
      >
        Enroll Child
      </Button>
      <Button
        variant="outlined"
        style={{
          marginTop: 20,
          marginBottom: 20,
          marginLeft: 10,
          marginRight: 20,
        }}
        onClick={() => setIsWithdrawalOpen(true)}
      >
        Withdraw Child
      </Button>
      {isWaitlist ? (
        <Button
          variant="outlined"
          style={{
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 10,
            marginRight: 20,
          }}
          onClick={() => setIsMoveChildDialog(true)}
        >
          Move to enrolled
        </Button>
      ) : null}
      <ToggleButtonGroup
        value={selected}
        exclusive
        onChange={handleSelection}
        aria-label="enrolled or waitlist"
        size="small"
        color="primary"
        variant="contained"
      >
        <ToggleButton value="enrolled" color="primary">
          Enrolled
        </ToggleButton>
        <ToggleButton value="waitlist">Waitlist</ToggleButton>
      </ToggleButtonGroup>
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
              <TableCell>
                {isWaitlist ? "Waitlist ID" : "EnrollmentID"}
              </TableCell>
              <TableCell align="center">Enrollment Date</TableCell>
              <TableCell align="center">Child Firstname</TableCell>
              <TableCell align="center">Child Lastname</TableCell>
              <TableCell align="center">DOB</TableCell>
              <TableCell align="center">Age Group</TableCell>
              <TableCell align="center">Allergies</TableCell>
              <TableCell align="center">Parent Names</TableCell>
              {isWaitlist ? null : <TableCell align="center">Invite</TableCell>}
              <TableCell align="center">PhoneNumber</TableCell>
              <TableCell align="center">Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(isWaitlist ? waitChildrenList : childrenList).map(
              (row, index) => (
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
                    {isWaitlist ? row.ID : row.EnrollmentID}
                  </TableCell>
                  <TableCell align="center">
                    {isWaitlist ? row.date : row.enrollmentDate}
                  </TableCell>
                  <TableCell align="center">
                    {isWaitlist ? row.FirstName : row.ChildFirstName}
                  </TableCell>
                  <TableCell align="center">
                    {isWaitlist ? row.LastName : row.ChildLastName}
                  </TableCell>
                  <TableCell align="center">{row.ChildDateOfBirth}</TableCell>
                  <TableCell align="center">{row.AgeGroup}</TableCell>
                  <TableCell align="center">{row.Allergies}</TableCell>
                  <TableCell align="center">
                    {row.ParentFirstName} {row.ParentLastName}
                  </TableCell>
                  {isWaitlist ? null : (
                    <TableCell align="center">
                      <Checkbox
                        checked={row.invite}
                        size="small"
                        onClick={() => sendInvite(row.ParentID)}
                        disabled={row.invite}
                        sx={{
                          padding: "0px",
                          "&.Mui-disabled": {
                            color: "#4d6b53",
                          },
                        }}
                      />
                    </TableCell>
                  )}
                  <TableCell align="center">{row.PhoneNumber}</TableCell>
                  <TableCell align="center">{row.Address}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={isOpen} onClose={closeEnrollForm}>
        <Grid sx={styles.conatiner}>
          {sendToWaitingList ? (
            <Grid>
              <Typography style={{ fontSize: "16px", marginBottom: "20px" }}>
                Capacity is full, do you want to add the child to waiting list?
              </Typography>
              <Button
                variant="outlined"
                size="small"
                style={{ marginRight: "10px" }}
                onClick={closeEnrollForm}
              >
                Cancel
              </Button>
              <Button variant="contained" size="small" onClick={addToWaitList}>
                Yes
              </Button>
            </Grid>
          ) : (
            <Form
              style={{ marginBottom: "10px" }}
              onSubmit={onSubmit}
              render={({ handleSubmit, form, values }) => (
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
                    <Typography sx={styles.heading}>Child Details</Typography>
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
                      name="Allergies"
                      render={({ input }) => (
                        <CMTextField
                          {...input}
                          label="Allergies"
                          error={errors.Allergies}
                          helperText={errors.Allergies}
                        />
                      )}
                    />
                    <Field
                      name="dob"
                      render={({ input }) => (
                        <CMDatePicker
                          label={"Date of Birth"}
                          error={errors.dob}
                          helperText={errors.dob}
                          {...input}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Typography sx={styles.heading}>Parent Details</Typography>
                    <Field
                      name="ParentFirstName"
                      render={({ input }) => (
                        <CMTextField
                          {...input}
                          label="First Name"
                          error={errors.ParentFirstName}
                          helperText={errors.ParentFirstName}
                        />
                      )}
                    />
                    <Field
                      name="ParentLastName"
                      render={({ input }) => (
                        <CMTextField
                          {...input}
                          label="Last Name"
                          error={errors.ParentLastName}
                          helperText={errors.ParentLastName}
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
                      parse={(value) =>
                        value.replace(/[^\d]/g, "").slice(0, 10)
                      }
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
                      name="consentForm"
                      defaultValue={consent}
                      render={({ input }) => (
                        <CMTextField
                          {...input}
                          label="Consent Form"
                          error={errors.consentForm}
                          helperText={errors.consentForm}
                          multiline
                          rows={3}
                        />
                      )}
                    />
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
          )}
        </Grid>
      </Dialog>
      <Dialog
        open={isWithdrawalOpen || isMoveChildDialog}
        onClose={() => {
          setIsClikedSearch(false);
          setselectedChildData({});
          setIsWithdrawalOpen(false);
          setIsMoveChildDialog(false);
        }}
      >
        <Grid sx={{ padding: "15px" }}>
          <Typography sx={styles.heading}>
            {isMoveChildDialog ? "Move to Enrolled" : "Withdraw Child"}
          </Typography>
          {isClikedSearch && selectedChildData.ChildDateOfBirth ? (
            <Grid>
              <Typography>
                ID:{" "}
                {isWaitlist
                  ? selectedChildData.ID
                  : selectedChildData.EnrollmentID}
              </Typography>
              <Typography>
                enrollmentDate:
                {isWaitlist
                  ? selectedChildData.date
                  : selectedChildData.enrollmentDate}
              </Typography>
              <Typography>
                Child FirstName:
                {isWaitlist
                  ? selectedChildData.FirstName
                  : selectedChildData.ChildFirstName}
              </Typography>
              <Typography>
                Child LastName:
                {isWaitlist
                  ? selectedChildData.LastName
                  : selectedChildData.ChildLastName}
              </Typography>
              <Typography>DOB: {selectedChildData.ChildDateOfBirth}</Typography>
              <Typography>Allergies: {selectedChildData.Allergies}</Typography>
              <Typography>
                Parent Names: {selectedChildData.ParentFirstName}{" "}
                {selectedChildData.ParentLastName}
              </Typography>
              <Typography>
                PhoneNumber: {selectedChildData.PhoneNumber}
              </Typography>
              <Typography>Address: {selectedChildData.Address}</Typography>
              <Typography sx={{ marginY: "10px" }}>
                Check the details and confirm
              </Typography>
            </Grid>
          ) : (
            <CMTextField
              placeholder="Enter EnrollmentID"
              label="Enter EnrollmentID"
              onChange={(event) => setEnrollmentID(event.target.value)}
              error={
                isClikedSearch
                  ? selectedChildData.ChildDateOfBirth
                    ? ""
                    : true
                  : ""
              }
              helperText={
                isClikedSearch
                  ? selectedChildData.ChildDateOfBirth
                    ? ""
                    : "No data found"
                  : ""
              }
            />
          )}
          <Button
            variant="contained"
            sx={{ mt: "20px" }}
            onClick={() =>
              isClikedSearch && selectedChildData.ChildDateOfBirth
                ? isMoveChildDialog
                  ? onSubmit(selectedChildData)
                  : withdrawChild()
                : searchData()
            }
          >
            {isClikedSearch && selectedChildData.ChildDateOfBirth
              ? "Submit"
              : "Search"}
          </Button>
        </Grid>
      </Dialog>
      <Dialog open={isInvite} onClose={() => setIsInvite(false)}>
        <Grid sx={{ padding: "15px" }}>
          <Typography sx={styles.heading}>Invite Parent</Typography>
          <CMTextField
            placeholder="Enter EnrollmentID"
            label="Enter EnrollmentID"
            onChange={(event) => setEnrollmentID(event.target.value)}
            onSubmit={sendInvite}
          />
        </Grid>
      </Dialog>
      <Snackbar open={message} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
