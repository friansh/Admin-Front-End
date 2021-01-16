import React from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function LoadingData() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "80vh" }}
    >
      <Grid item xs={3}>
        <CircularProgress />
      </Grid>
    </Grid>
  );
}
