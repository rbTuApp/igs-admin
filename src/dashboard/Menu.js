import React, { Fragment, useContext, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import {
  Assignment,
  ExitToApp,
  History,
  Notifications,
  Restaurant,
  Settings,
  Storefront,
} from "@mui/icons-material";
import {
  alpha,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Popover,
  Select,
  Switch,
} from "@mui/material";
import { green } from "@mui/material/colors";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Admins from "./Admins";
import { consumeGet, URL } from "../utils/constants";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Doctors from "./Doctors";
import Users from "./Users";
import UserDoctor from "../doctors/UserDoctor";
import Reserves from "../doctors/Reserves";
import EventIcon from '@mui/icons-material/Event';
import PQR from "./PQR";
const drawerWidth = 80;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const Navigator = () => {
  const theme = useTheme();
  const { user, logout, reunion } =
    useContext(AuthContext);
  const open = true;
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);

  const open2 = Boolean(anchorEl);
  const [condition, setCondition] = useState(1);
  let navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let conditional = location.pathname.split("/");
    console.log(conditional)
    if (conditional[1] === "doctors" || conditional[1] === "reserves") {
      setCondition(2)
    } else if (conditional[1] === "pacients") {

      setCondition(3)
    } else {
      setCondition(1)
    }
  }, [location])
  console.log(reunion)
  if (reunion) return <Fragment></Fragment>;
  return (
    <Fragment>
      <Dialog open={logoutModal}>
        <Box
          style={{
            padding: 12,
            marginLeft: 40,
            marginRight: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DialogTitle
            style={{
              marginBottom: 20,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            Cerrar sesión
          </DialogTitle>
          <DialogContent>
            <Typography style={{ marginBottom: 12 }}>¿Estas seguro?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              color="inherit"
              onClick={() => setLogoutModal(false)}
              variant="contained"
              style={{ width: "50%" }}
            >
              Cancelar
            </Button>
            <Button
              style={{ width: "50%" }}
              onClick={() => logout()}
              variant="contained"
            >
              Ok
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.primary.main,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >

        <List
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-around",
            padding: 10
          }}
        >
          <ListItem
            onClick={() => navigate("/")}
            style={
              condition === 1
                ? {
                  backgroundColor: "white",
                  color: theme.palette.primary.main,
                  justifyContent: "center",
                  borderRadius: 8
                }
                : { justifyContent: "center" }
            }
            button
          >
            <ListItemIcon style={{ justifyContent: "center", minWidth: 0 }}>
              <AccountBoxIcon
                sx={{ fontSize: 35, textAlign: "center", color: condition === 1 ? theme.palette.primary.main : "white" }}
              />
            </ListItemIcon>
          </ListItem>
          {
            !user.isDoctor ? (
              <Fragment>

                <ListItem
                  onClick={() => navigate("/doctors")}
                  style={
                    condition === 2
                      ? {
                        backgroundColor: "white",
                        color: theme.palette.primary.main,
                        justifyContent: "center",
                        borderRadius: 8
                      }
                      : { justifyContent: "center" }
                  }
                  button
                >
                  <ListItemIcon style={{ justifyContent: "center", minWidth: 0 }}>
                    <PersonIcon
                      sx={{ fontSize: 35, textAlign: "center", color: condition === 2 ? theme.palette.primary.main : "white" }}
                    />
                  </ListItemIcon>
                </ListItem>
                <ListItem
                  onClick={() => navigate("/pacients")}
                  style={
                    condition === 3
                      ? {
                        backgroundColor: "white",
                        color: theme.palette.primary.main,
                        justifyContent: "center",
                        borderRadius: 8
                      }
                      : { justifyContent: "center" }
                  }
                  button
                >
                  <ListItemIcon style={{ justifyContent: "center", minWidth: 0 }}>
                    <GroupIcon
                      sx={{ fontSize: 35, textAlign: "center", color: condition === 3 ? theme.palette.primary.main : "white" }}
                    />
                  </ListItemIcon>
                </ListItem>
              </Fragment>
            ) : (
              <Fragment>
                <ListItem
                  onClick={() => navigate("/reserves")}
                  style={
                    condition === 2
                      ? {
                        backgroundColor: "white",
                        color: theme.palette.primary.main,
                        justifyContent: "center",
                        borderRadius: 8
                      }
                      : { justifyContent: "center" }
                  }
                  button
                >
                  <ListItemIcon style={{ justifyContent: "center", minWidth: 0 }}>
                    <EventIcon
                      sx={{ fontSize: 35, textAlign: "center", color: condition === 2 ? theme.palette.primary.main : "white" }}
                    />
                  </ListItemIcon>
                </ListItem>
              </Fragment>
            )
          }
          <ListItem
            onClick={() => setLogoutModal(true)}
            style={{ justifyContent: "center" }}
            button
          >
            <ListItemIcon style={{ justifyContent: "center", minWidth: 0 }}>
              <ExitToApp
                sx={{ fontSize: 35, textAlign: "center", color: "white" }}
              />
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
    </Fragment>
  );
};

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const open = true;

  const {
    user,
  } = useContext(AuthContext);
  return (
    <Box sx={{ display: "flex" }}>
      <Router>
        <CssBaseline />
        <Navigator />
        <Main open={open}>
          <DrawerHeader />

          <Routes>
            {
              !user.isDoctor ? (
                <Fragment>
                  <Route path="/" element={<Admins />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/pacients" element={<Users />} />
                </Fragment>
              ) : (
                <Fragment>
                  <Route path="/" element={<UserDoctor />} />
                  <Route path="/reserves" element={<Reserves />} />
                </Fragment>
              )
            }
          </Routes>
        </Main>
      </Router>
    </Box >
  );
}
