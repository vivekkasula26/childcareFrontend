import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Collapse, Grid } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SchoolIcon from "@mui/icons-material/School";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useLocation, useNavigate } from "react-router-dom";
import { EnrollChild } from "../EnrollChild/EnrollChild";
import { ROUTE_PATH } from "../GlobalFunctions/routePath";
import { ManageStaff } from "../ManageStaff/ManageStaff";
import { ManageClassroom } from "../Manageclassroom/ManageClassroom";
import { AccountingLedger } from "../AccountingLedger/AccountingLedger";
import { API_URLS } from "../GlobalFunctions/APIs";
import { getHeaderConfig } from "../GlobalFunctions/API_header_config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  selectIsAuthenticated,
  selectUser,
} from "../../redux/userSlice";
import { StaffAttendance } from "../Attendance/StaffAttendance";
import { PersonalInformation } from "../PersonalInformation/PersonalInformation";
import { StudentAttendance } from "../StudentAttendance/StudentAttendance";
import { Report } from "../Report/Report";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { LedgerReport } from "../Report/LedgerReport";
import { ParentPI } from "../PersonalInformation/ParentPI";
import PersonIcon from "@mui/icons-material/Person";
import { Facilityinformation } from "../PersonalInformation/FacilityInformation";

const drawerWidth = 240;

export const DraweComponent = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const HEADER_CONFIG = getHeaderConfig(user);
  const location = useLocation();
  const navigate = useNavigate();
  const isParent = user.role && user.role == "Parent";
  const isTeacher = user.role && user.role == "Teacher";
  const isAdmin = user.role && user.role == "Admin";
  const [selectedItem, setSelectedItem] = useState(
    isAdmin
      ? "Enroll Child"
      : isTeacher
      ? "Student Attendance"
      : "Presonal Information"
  );
  const [checked, setChecked] = useState(false);
  const [selectedSubmenu, setSelectedSubmenu] = useState("");

  const singOut = () => {
    if (isTeacher) {
      axios.post(API_URLS.SIGN_OUT, user, HEADER_CONFIG).then(({ data }) => {
        navigate(ROUTE_PATH.HOME_PAGE);
        dispatch(logoutUser());
      });
    } else {
      navigate(ROUTE_PATH.HOME_PAGE);
    }
  };

  useEffect(() => {
    (isAdmin
      ? drawerList
      : isTeacher
      ? teacherDrawerList
      : parentDrawerList
    ).map((item, index) => {
      if (location.pathname == item.pathname) {
        setSelectedItem(item.text);
      }
    });
  }, [location.pathname]);

  const drawerList = [
    {
      text: "Enroll Child",
      Icon: PersonAddIcon,
      Component: EnrollChild,
      pathname: ROUTE_PATH.ENROLL_CHILD,
    },
    {
      text: "Manage Staff",
      Icon: ManageAccountsIcon,
      Component: ManageStaff,
      pathname: ROUTE_PATH.MANAGE_STAFF,
    },
    {
      text: "Classroom",
      Icon: SchoolIcon,
      Component: ManageClassroom,
      pathname: ROUTE_PATH.MANAGE_CLASSROOM,
    },
    {
      text: "Staff Attendance",
      Icon: EventNoteIcon,
      Component: StaffAttendance,
      pathname: ROUTE_PATH.ATTENDANCE,
    },
    {
      text: "Accounting Ledger",
      Icon: AccountBalanceIcon,
      Component: AccountingLedger,
      pathname: ROUTE_PATH.ACCOUNTING_LEDGER,
    },

    {
      text: "Reports",
      Icon: LeaderboardIcon,
      Component: Report,
      pathname: ROUTE_PATH.REPORTS,
      submenu: [
        {
          text: "Attendance",
        },
        {
          text: "Ledger Report",
        },
      ],
    },
    {
      text: "Facility Information",
      Icon: PersonIcon,
      Component: Facilityinformation,
      pathname: ROUTE_PATH.PERSONAL_INFORMATION,
    },
  ];

  const teacherDrawerList = [
    {
      text: "Student Attendance",
      Icon: EventNoteIcon,
      Component: StudentAttendance,
      pathname: ROUTE_PATH.ACCOUNTING_LEDGER,
    },
    {
      text: "Attendance & Accounting",
      Icon: AccountBalanceIcon,
      Component: StaffAttendance,
      pathname: ROUTE_PATH.ATTENDANCE_ACCOUNTING,
    },
    {
      text: "Personal Information",
      Icon: PersonIcon,
      Component: PersonalInformation,
      pathname: ROUTE_PATH.PERSONAL_INFORMATION,
    },
  ];
  const parentDrawerList = [
    {
      text: "Presonal Information",
      Icon: ManageAccountsIcon,
      Component: ParentPI,
      pathname: ROUTE_PATH.PERSONAL_INFORMATION,
    },
    {
      text: "Child Attendance",
      Icon: EventNoteIcon,
      Component: StaffAttendance,
      pathname: ROUTE_PATH.CHILD_ATTENDANCE,
    },
    {
      text: "Accounting and Ledger",
      Icon: AccountBalanceIcon,
      Component: AccountingLedger,
      pathname: ROUTE_PATH.ACCOUNTING_LEDGER,
    },
  ];

  return (
    <Grid sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: "55px",
          backgroundColor: "#07255d ! important",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            margin: "auto 0px",
            padding: "10px 15px",
            flexFlow: "row",
            alignItems: "center",
          }}
        >
          <SchoolIcon sx={{ fontSize: 30, marginRight: "15px" }} />
          <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
            Childcare Management (
            {isAdmin
              ? "Facility Admin"
              : isTeacher
              ? "Staff Login"
              : "Parent Login"}
            )
          </Typography>
        </Grid>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f8f9fb",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Grid sx={{ height: 55 }} />
        <Divider />
        <List>
          {(isAdmin
            ? drawerList
            : isTeacher
            ? teacherDrawerList
            : parentDrawerList
          ).map(({ text, Icon, pathname, submenu = [] }, index) => (
            <Grid sx={{ display: "flex", flexFlow: "column" }}>
              <ListItem
                key={text}
                disablePadding
                onClick={() => {
                  navigate(pathname);
                  setSelectedItem(text);
                  setChecked(false);

                  setSelectedSubmenu("");
                  if (text == "Reports") {
                    if (!selectedSubmenu) {
                      setSelectedSubmenu("Attendance");
                    }
                    setChecked(!checked);
                  }
                }}
                sx={[
                  selectedItem == text && { backgroundColor: "#accef4" },
                  { borderRadius: "30px", overflow: "hidden" },
                ]}
              >
                <ListItemButton>
                  <ListItemIcon
                    sx={selectedItem == text && { color: "#07255d" }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={
                      selectedItem == text && {
                        "& .MuiTypography-root": {
                          fontWeight: "bold !important",
                          color: "#07255d",
                        },
                      }
                    }
                  />
                </ListItemButton>
              </ListItem>
              {submenu.length ? (
                <Collapse in={checked}>
                  {submenu.map((item, index) => (
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => setSelectedSubmenu(item.text)}
                      >
                        <ListItemText
                          primary={item.text}
                          sx={
                            selectedSubmenu == item.text && {
                              "& .MuiTypography-root": {
                                fontWeight: "bold !important",
                                color: "#07255d",
                              },
                            }
                          }
                          style={{ paddingLeft: "40px" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Collapse>
              ) : (
                <></>
              )}
              {index == 3 && <Divider sx={{ my: "5px" }} />}
            </Grid>
          ))}
          <ListItem
            disablePadding
            onClick={singOut}
            sx={[{ borderRadius: "30px", overflow: "hidden" }]}
          >
            <ListItemButton>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={"Sign Out"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Grid
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Grid sx={{ height: 55 }} />
        {(isAdmin
          ? drawerList
          : isTeacher
          ? teacherDrawerList
          : parentDrawerList
        ).map(({ Component, text }, index) => {
          return index == 5 ? (
            selectedSubmenu == "Attendance" ? (
              <Report />
            ) : selectedSubmenu == "Ledger Report" ? (
              <LedgerReport />
            ) : (
              <></>
            )
          ) : (
            selectedItem == text && <Component />
          );
        })}
      </Grid>
    </Grid>
  );
};
