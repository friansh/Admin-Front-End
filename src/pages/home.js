import {
  Typography,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import MiniDrawer from "../components/drawer";
import LoadingData from "../components/loading";
import { useCookies } from "react-cookie";
import Axios from "axios";
import { Doughnut, Bar, Line } from "react-chartjs-2";

export default function Home(props) {
  const [cookies, setCookies, removeCookies] = useCookies();

  const [user, setUser] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    Axios.post(
      "/auth/me",
      {},
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    ).then((response) => {
      setUser(response.data);
      setUserLoaded(true);
    });
  }, []);

  if (!userLoaded)
    return (
      <MiniDrawer>
        <LoadingData />
      </MiniDrawer>
    );

  return (
    <MiniDrawer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9}>
          <Typography variant="h5" style={{ marginBottom: 12 }}>
            Selamat datang, {user.first_name}!
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Informasi
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }} align="right">
                    Data
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Hak akses
                  </TableCell>
                  <TableCell align="right">
                    {user.acl === 1 ? "Administrator" : "Master"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Waktu log masuk terakhir
                  </TableCell>
                  <TableCell align="right">DOR</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    IP log masuk terakhir
                  </TableCell>
                  <TableCell align="right">{user.last_ip}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={1} style={{ marginTop: 12 }}>
            <Grid item xs={12} md={3}>
              <Paper style={{ padding: 12 }}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Registered User
                </Typography>
                <Typography variant="subtitle2">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper style={{ padding: 12 }}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Article Count
                </Typography>
                <Typography variant="subtitle2">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper style={{ padding: 12 }}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Product Count
                </Typography>
                <Typography variant="subtitle2">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper style={{ padding: 12 }}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  FAQ Count
                </Typography>
                <Typography variant="subtitle2">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 12 }}>
                <Bar
                  data={{
                    labels: [
                      "Africa",
                      "Asia",
                      "Europe",
                      "Latin America",
                      "North America",
                    ],
                    datasets: [
                      {
                        label: "Population (millions)",
                        backgroundColor: [
                          "#3e95cd",
                          "#8e5ea2",
                          "#3cba9f",
                          "#e8c3b9",
                          "#c45850",
                        ],
                        data: [2478, 5267, 734, 784, 433],
                      },
                    ],
                  }}
                  options={{
                    legend: { display: false },
                    title: {
                      display: true,
                      text: "Predicted world population (millions) in 2050",
                    },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 12 }}>
                <Doughnut
                  data={{
                    labels: [
                      "Africa",
                      "Asia",
                      "Europe",
                      "Latin America",
                      "North America",
                    ],
                    datasets: [
                      {
                        label: "Population (millions)",
                        backgroundColor: [
                          "#3e95cd",
                          "#8e5ea2",
                          "#3cba9f",
                          "#e8c3b9",
                          "#c45850",
                        ],
                        data: [2478, 5267, 734, 784, 433],
                      },
                    ],
                  }}
                  options={{
                    title: {
                      display: true,
                      text: "Predicted world population (millions) in 2050",
                    },
                    legend: {
                      position: "bottom",
                    },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper style={{ padding: 12 }}>
                <Line
                  data={{
                    labels: [1500, 1600, 1700],
                    datasets: [
                      {
                        data: [86, 114, 106],
                        label: "Africa",
                        borderColor: "#3e95cd",
                        fill: false,
                      },
                    ],
                  }}
                  options={{
                    title: {
                      display: true,
                      text: "World population per region (in millions)",
                    },
                    legend: {
                      position: "bottom",
                    },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper style={{ padding: 12 }}>
            <Typography variant="h6" align="center">
              Bantuan
            </Typography>
            <hr />
            <Typography variant="body2">
              Pada panel admin ini anda bisa melakukan hal-hal berikut:
              <ul>
                <li>cek satu</li>
                <li>cek dua</li>
              </ul>
              Silahkan pilih aksi yang diinginkan dengan mengklik menu yang ada
              di sebelah kiri layar.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </MiniDrawer>
  );
}
