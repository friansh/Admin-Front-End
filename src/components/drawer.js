import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faChair,
  faClipboard,
  faUsers,
  faUserCog,
  faHome,
  faNetworkWired,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

import { Link, Redirect } from "react-router-dom";
import Axios from "axios";
import { useCookies } from "react-cookie";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function MiniDrawer(props) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [redirect, setRedirect] = useState();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Axios.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    ).then(() => {
      setAnchorEl(null);
      window.alert("You have logged out");
      setRedirect("/login");
    });
  };

  useEffect(() => {
    Axios.post(
      "/auth/me",
      {},
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    ).catch((error) => {
      if (error.response.status == 401) setRedirect("/login");
    });
  }, []);

  if (redirect) return <Redirect to={redirect} />;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        style={{ backgroundColor: "#673ab7" }}
      >
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" className={classes.title} noWrap>
                {props.title !== undefined
                  ? props.title
                  : "Loakarya Admin Page"}
              </Typography>
            </Grid>
            <Grid item>
              {/* <Button
                onClick={handleMenuClick}
                startIcon={<AccountCircleIcon style={{ color: "white" }} />}
                style={{ color: "white" }}
              >
                {props.user !== undefined
                  ? props.user.first_name + " " + props.user.last_name
                  : ""}
              </Button> */}
              <IconButton onClick={handleMenuClick}>
                <AccountCircleIcon style={{ color: "white" }} />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <FontAwesomeIcon icon={faHome} size="lg" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button component={Link} to="/article">
            <ListItemIcon>
              <FontAwesomeIcon icon={faBook} size="lg" />
            </ListItemIcon>
            <ListItemText primary="Article" />
          </ListItem>

          <ListItem button component={Link} to="/product">
            <ListItemIcon>
              <FontAwesomeIcon icon={faChair} size="lg" />
            </ListItemIcon>
            <ListItemText primary="Product" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <FontAwesomeIcon icon={faBox} size="lg" />
            </ListItemIcon>
            <ListItemText primary="Asset" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <FontAwesomeIcon icon={faClipboard} size="lg" />
            </ListItemIcon>
            <ListItemText primary="Form" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <FontAwesomeIcon icon={faUsers} size="lg" />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <FontAwesomeIcon icon={faNetworkWired} size="lg" />
            </ListItemIcon>
            <ListItemText primary="IoT Management" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <FontAwesomeIcon icon={faUserCog} size="lg" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
