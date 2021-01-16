import {
  Button,
  Grid,
  Paper,
  Typography,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  IconButton,
} from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";

import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import MiniDrawer from "../../components/drawer";
import LoadingData from "../../components/loading";
import { Link as RouterLink } from "react-router-dom";
import Axios from "axios";
import { useCookies } from "react-cookie";
import Moment from "react-moment";

const useStyles = makeStyles({
  paper: {
    paddingTop: 6,
    paddingLeft: 12,
    paddingBottom: 6,
    paddingRight: 12,
  },
});

export default function ArticleIndex(props) {
  const classes = useStyles();

  const [cookies, setCookies, removeCookies] = useCookies();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [articlesLoaded, setArticlesLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [articleDeleteDialog, setArticleDeleteDialog] = useState(false);
  const [articleDeleteCandidate, setArticleDeleteCandidate] = useState([]);
  const [categoryDeleteDialog, setCategoryDeleteDialog] = useState(false);
  const [categoryDeleteCandidate, setCategoryDeleteCandidate] = useState([]);
  const [categoryEditDialog, setCategoryEditDialog] = useState(false);
  const [categoryEditCandidate, setCategoryEditCandidate] = useState([]);
  const [categoryNewNameCandidate, setCategoryNewNameCandidate] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [categoryAddDialog, setCategoryAddDialog] = useState(false);
  const [categoryAddCandidate, setCategoryAddCandidate] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const handleDialogClose = () => {
    setArticleDeleteDialog(false);
    setCategoryDeleteDialog(false);
    setCategoryAddDialog(false);
    setCategoryEditDialog(false);
  };

  const handleArticleDeleteOpen = (article) => {
    setArticleDeleteCandidate(article);
    setArticleDeleteDialog(true);
  };

  const handleCategoryDeleteOpen = (category) => {
    setCategoryDeleteCandidate(category);
    setCategoryDeleteDialog(true);
  };

  const handleCategoryEditOpen = (category) => {
    setCategoryEditCandidate(category);
    setCategoryNewNameCandidate(category.name);
    setCategoryEditDialog(true);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCategoryAddChange = (event) => {
    setCategoryAddCandidate(event.target.value);
  };

  const handleCategoryEditChange = (event) => {
    setCategoryNewNameCandidate(event.target.value);
  };

  const handleCategoryAdd = () => {
    setCategoryAddDialog(true);
  };

  const handleDeleteArticle = () => {
    setLoadingAction(true);
    Axios.delete("/article/" + articleDeleteCandidate.id, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then(() => {
        handleSnackbarOpen("The article has been deleted.");
        refreshArticle();
      })
      .catch((error) => {
        handleSnackbarOpen("Failed to delete the article.");
        console.log(error.response);
      })
      .finally(() => {
        handleDialogClose();
        setLoadingAction(false);
      });
  };

  const handleDeleteCategory = () => {
    setLoadingAction(true);
    Axios.delete("/article/category/" + categoryDeleteCandidate.id, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then(() => {
        handleSnackbarOpen("The article category has been deleted.");
        refreshCategory();
      })
      .catch((error) => {
        handleSnackbarOpen("Failed to delete the article category.");
        console.log(error.response);
      })
      .finally(() => {
        handleDialogClose();
        setLoadingAction(false);
      });
  };

  const handleAddCategory = () => {
    setLoadingAction(true);
    Axios.put(
      "/article/category",
      {
        name: categoryAddCandidate,
      },
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    )
      .then(() => {
        handleSnackbarOpen("The new article category has been added.");
        refreshCategory();
      })
      .catch((error) => {
        handleSnackbarOpen("Failed to add the new article category.");
        console.log(error.response.data);
      })
      .finally(() => {
        handleDialogClose();
        setLoadingAction(false);
      });
  };

  const handleEditCategory = () => {
    setLoadingAction(true);
    Axios.patch(
      "/article/category/" + categoryEditCandidate.id,
      {
        name: categoryNewNameCandidate,
      },
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    )
      .then(() => {
        handleSnackbarOpen("The article category has been edited.");
        refreshCategory();
      })
      .catch((error) => {
        handleSnackbarOpen("Failed to edit the new article category.");
        console.log(error.response.data);
      })
      .finally(() => {
        handleDialogClose();
        setLoadingAction(false);
      });
  };

  useEffect(() => {
    refreshArticle();
    refreshCategory();
  }, []);

  const refreshArticle = () => {
    Axios.get("/article/user", {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    }).then((response) => {
      setArticles(response.data.data);
      setArticlesLoaded(true);
    });
  };

  const refreshCategory = () => {
    Axios.get("/article/category").then((response) => {
      setCategories(response.data);
      setCategoriesLoaded(true);
    });
  };

  if (!articlesLoaded && !categoriesLoaded)
    return (
      <MiniDrawer>
        <LoadingData />
      </MiniDrawer>
    );

  return (
    <MiniDrawer title="Article Index">
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: 12 }}
        component={RouterLink}
        to="/article/create"
        startIcon={<AddIcon />}
      >
        Article
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          {articles.map((article) => {
            let category = "Uncategorized";
            categories.find((cv) => {
              if (article.category == cv.id) category = cv.name;
            });
            return (
              <Paper
                className={classes.paper}
                key={article.id}
                style={{ marginBottom: 12 }}
              >
                <Grid container spacing={1}>
                  <Grid item>
                    <img
                      src={
                        process.env.REACT_APP_API_URL +
                        "/storage/article/" +
                        article.thumbnail_url
                      }
                      style={{ maxWidth: 75, marginTop: 6 }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Grid container alignItems="center" justify="space-between">
                      <Grid item>
                        <Link
                          component={RouterLink}
                          to={"/article/" + article.id}
                        >
                          <Typography variant="h6">{article.title}</Typography>
                        </Link>
                      </Grid>
                      <Grid item>
                        <Typography variant="caption">
                          <Moment
                            format="dddd, DD/MM/YYYY"
                            date={article.created_at}
                          />
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="flex-start">
                      <Grid item xs>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item>
                            <Typography variant="caption">
                              {category}
                            </Typography>
                          </Grid>
                          <Grid item>&bull;</Grid>
                          <Grid item xs>
                            <Typography variant="subtitle1">
                              {article.subtitle}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <IconButton
                          color="secondary"
                          onClick={() => handleArticleDeleteOpen(article)}
                        >
                          <DeleteIcon style={{ color: "#c2185b" }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 6, marginBottom: 12 }}>
            <Typography variant="h6" align="center">
              Category
            </Typography>
            <List>
              {categories.map((category) => {
                return (
                  <React.Fragment key={category.id}>
                    <ListItem
                      button
                      onClick={() => handleCategoryEditOpen(category)}
                    >
                      <ListItemText primary={category.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="secondary"
                          onClick={() => handleCategoryDeleteOpen(category)}
                        >
                          <DeleteIcon style={{ color: "#c2185b" }} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
            <Grid container justify="flex-end">
              <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: 12 }}
                onClick={handleCategoryAdd}
                endIcon={<AddIcon />}
              >
                Category
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={articleDeleteDialog} onClose={handleDialogClose}>
        {loadingAction ? <LinearProgress /> : null}
        <DialogTitle>Article Deletion Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete the article{" "}
            <b>{articleDeleteCandidate.title}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteArticle} color="primary" autoFocus>
            I'm Sure
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={categoryDeleteDialog} onClose={handleDialogClose}>
        {loadingAction ? <LinearProgress /> : null}
        <DialogTitle>Article Deletion Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete the category{" "}
            <b>{categoryDeleteCandidate.name}</b>? The articles related to this
            category will be set to uncategorized. You'll need to update the
            category in each article.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCategory} color="primary" autoFocus>
            I'm Sure
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarText}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Dialog open={categoryAddDialog} onClose={handleDialogClose}>
        {loadingAction ? <LinearProgress /> : null}
        <DialogTitle>Add a New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To insert a new article category, please fill the category name on
            the section below and then click the <b>Add</b> button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            onChange={handleCategoryAddChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={categoryEditDialog} onClose={handleDialogClose}>
        {loadingAction ? <LinearProgress /> : null}
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are going to edit <b>{categoryEditCandidate.name}</b> article
            category. To continue, please fill the category name on the section
            below and then click the <b>Edit</b> button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Category Name"
            value={categoryNewNameCandidate}
            fullWidth
            onChange={handleCategoryEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditCategory} color="primary">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </MiniDrawer>
  );
}
