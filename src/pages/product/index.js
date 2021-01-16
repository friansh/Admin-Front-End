import React, { useState, useEffect } from "react";
import MiniDrawer from "../../components/drawer";
import LoadingData from "../../components/loading";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import AddIcon from "@material-ui/icons/Add";

import { Link as RouterLink } from "react-router-dom";
import Axios from "axios";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
});

export default function IndexProduct(props) {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    Axios.get("/product").then((response) => {
      setProducts(response.data.data);
      setProductsLoaded(true);
    });
  }, []);

  if (!productsLoaded)
    return (
      <MiniDrawer>
        <LoadingData />
      </MiniDrawer>
    );

  return (
    <MiniDrawer title="Product Index">
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: 12 }}
        component={RouterLink}
        to="/article/create"
        startIcon={<AddIcon />}
      >
        Product
      </Button>
      <Grid container spacing={2}>
        {products.map((product) => {
          return (
            <Grid item xs={3} key={product.id}>
              <Card className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={product.thumbnail_url}
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.title}
                    </Typography>
                    <Typography variant="subtitle2">
                      {product.category === 0
                        ? "Authentic Product"
                        : "Product on Demand"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      style={{ marginBottom: 12 }}
                    >
                      {product.detail.length < 100
                        ? product.detail
                        : product.detail.slice(0, 100) + "..."}
                    </Typography>
                    <Typography variant="caption">
                      Rp.{product.price.toLocaleString("id")}.00 (-
                      {product.discount}%)
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </MiniDrawer>
  );
}
