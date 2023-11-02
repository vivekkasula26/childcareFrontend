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
import { Grid } from "@mui/material";
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

const drawerWidth = 240;

export const DraweComponent = () => {
  const [selectedItem, setSelectedItem] = useState("Enroll Child");

  const location = useLocation();
  const navigate = useNavigate();

  console.log(location);

  useEffect(() => {
    drawerList.map((item, index) => {
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
      text: "Attendance",
      Icon: EventNoteIcon,
      Component: EnrollChild,
      pathname: ROUTE_PATH.ATTENDANCE,
    },
    {
      text: "Accounting Ledger",
      Icon: AccountBalanceIcon,
      Component: EnrollChild,
      pathname: ROUTE_PATH.ACCOUNTING_LEDGER,
    },
    {
      text: "Reports",
      Icon: LeaderboardIcon,
      Component: EnrollChild,
      pathname: ROUTE_PATH.REPORTS,
    },
    {
      text: "Signout",
      Icon: ExitToAppIcon,
      Component: EnrollChild,
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
            Childcare Management
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
          {drawerList.map(({ text, Icon, pathname }, index) => (
            <>
              <ListItem
                key={text}
                disablePadding
                onClick={() => {
                  // window.history.replaceState(null, "", pathname);
                  navigate(pathname);
                  setSelectedItem(text);
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
              {index == 3 && <Divider />}
            </>
          ))}
        </List>
      </Drawer>
      <Grid
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Grid sx={{ height: 55 }} />
        {drawerList.map(({ Component, text }) => {
          return selectedItem == text && <Component />;
        })}
      </Grid>
    </Grid>
  );
};
