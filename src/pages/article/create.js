import React, { useState, useEffect } from "react";
import MiniDrawer from "../../components/drawer";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Typography, Button, Grid, TextField, Paper } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import Axios from "axios";

const classes = {
  mb: {
    marginBottom: 12,
  },
  mt: {
    marginTop: 12,
  },
};

export default function CreateArticle(props) {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [redirect, setRedirect] = useState();

  const [category, setCategory] = useState("uncategorized");
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [content, setContent] = useState();
  const [slug, setSlug] = useState();

  const [categories, setCategories] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  useEffect(() => {
    Axios.get("/article/category").then((response) => {
      setCategories(response.data);
    });
  }, []);

  const uploadThumbnail = (event) => {
    console.log(event.target.files[0]);

    let form = new FormData();
    form.append("upload", event.target.files[0]);

    Axios.post("/article/image", form, {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    })
      .then((response) => {
        let thumbnail = response.data.url;
        thumbnail = thumbnail.split("/");
        thumbnail = thumbnail[thumbnail.length - 1];
        setThumbnail(thumbnail);
        handleSnackbarOpen("File uploaded.");
      })
      .catch((error) => {
        console.log(error.response);
        handleSnackbarOpen("File upload failed, please refresh this page!");
      });
  };

  const handlePublishArticle = () => {
    if (!title || !subtitle || !content || !thumbnail || !category) {
      setTimeout(
        () => handleSnackbarOpen("Please fill all the required section!"),
        500
      );
    } else {
      Axios.put(
        "/article",
        {
          title: title,
          subtitle: subtitle,
          category: category,
          content: content,
          thumbnail_url: thumbnail,
          slug: slug,
        },
        {
          headers: {
            Authorization: "Bearer " + cookies.access_token,
          },
        }
      )
        .then(() => {
          handleSnackbarOpen(
            "The article has been saved, redirecting to menu..."
          );
          setTimeout(() => setRedirect("/article"), 2000);
        })
        .catch((error) => {
          console.log(error.response);
          handleSnackbarOpen("Failed to create article.");
        });
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubtitleChange = (event) => {
    setSubtitle(event.target.value);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSlugChange = (event) => {
    setSlug(event.target.value);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarText(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (redirect) return <Redirect to={redirect} />;

  return (
    <MiniDrawer title="Create A New Article">
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <TextField
            label="Title"
            variant="outlined"
            size="small"
            style={classes.mb}
            fullWidth
            onChange={handleTitleChange}
          />
          <TextField
            label="Subtitle"
            variant="outlined"
            size="small"
            style={classes.mb}
            fullWidth
            onChange={handleSubtitleChange}
          />
          <CKEditor
            editor={ClassicEditor}
            config={{
              simpleUpload: {
                uploadUrl: process.env.REACT_APP_API_URL + "/api/article/image",
                headers: {
                  Authorization: "Bearer " + cookies.access_token,
                },
              },
            }}
            // data="<p>Hello from CKEditor 5!</p>"
            // onReady={ editor => {
            //     // You can store the "editor" and use when it is needed.
            //     console.log( 'Editor is ready to use!', editor );
            // } }
            onChange={(event, editor) => {
              handleContentChange(editor.getData());
              // const data = editor.getData();
              // console.log({ event, editor, data });
            }}
            // onBlur={(event, editor) => {
            //   console.log("Blur.", editor);
            // }}
            // onFocus={(event, editor) => {
            //   console.log("Focus.", editor);
            // }}
          />
          <Grid container style={classes.mt} justify="flex-end">
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={handlePublishArticle}
              >
                Publish
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper style={{ padding: 12 }}>
            <Typography variant="h6" align="center">
              Article Attributes
            </Typography>
            <Typography variant="subtitle2" style={classes.mt}>
              <b>Thumbnail Picture</b>
            </Typography>
            {thumbnail ? (
              <img
                src={
                  process.env.REACT_APP_API_URL +
                  "/storage/article/" +
                  thumbnail
                }
                width="100%"
              />
            ) : null}
            <input
              type="file"
              onChange={uploadThumbnail}
              accept="image/png, image/jpeg"
            />

            <Typography variant="subtitle2" style={classes.mt}>
              <b>Category</b>
            </Typography>
            <form>
              {categories.map((category) => {
                return (
                  <React.Fragment key={category.id}>
                    <input
                      type="radio"
                      id={category.id}
                      name="category"
                      value={category.id}
                      onClick={handleCategoryChange}
                    />
                    <label htmlFor={category.id}>{category.name}</label>
                    <br />
                  </React.Fragment>
                );
              })}
            </form>
            {/* <Typography variant="subtitle2" style={classes.mt}>
              <b>Slug</b>
            </Typography> */}
            <TextField
              label="Slug"
              variant="outlined"
              size="small"
              style={classes.mt}
              fullWidth
              onChange={handleSlugChange}
            />
          </Paper>
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
    </MiniDrawer>
  );
}
