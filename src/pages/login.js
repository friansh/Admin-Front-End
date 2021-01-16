import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";

import { Redirect } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import Axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://loakarya.co/">
        Loakarya Indonesia
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [redirect, setRedirect] = useState();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);

    Axios.post("/auth/login", {
      email: email,
      password: password,
    })
      .then((response) => {
        console.log(response.data.access_token);
        removeCookie("access_token");
        setCookie("access_token", response.data.access_token);
        handleSnackbarOpen(
          "Logged in, you will be redirected to the dashboard page..."
        );
        setTimeout(() => {
          setRedirect("/");
        }, 2000);
      })
      .catch((error) => {
        console.log(error.response);
        handleSnackbarOpen("Failed to login, please recheck your credentials.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (redirect) return <Redirect to={redirect} />;

  return (
    <CookiesProvider>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleEmailChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                style={{ marginBottom: 24 }}
              />
              {loading ? <LinearProgress /> : null}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                // className={classes.submit}
                onClick={handleLogin}
                style={{ marginBottom: 24 }}
              >
                Sign In
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarText}
      />
    </CookiesProvider>
  );
}
