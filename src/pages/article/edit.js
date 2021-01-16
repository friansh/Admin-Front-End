import React, { useEffect, useState } from "react";
import MiniDrawer from "../../components/drawer";
import LoadingData from "../../components/loading";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const classes = {
  mb: {
    marginBottom: 12,
  },
  mt: {
    marginTop: 12,
  },
};

export default function EditArticle(props) {
  let { id } = useParams();
  const [cookies, setCookies, removeCookies] = useCookies();
  const [redirect, setRedirect] = useState();

  const [categories, setCategories] = useState([]);

  const [articleId, setArticleId] = useState();
  const [category, setCategory] = useState("uncategorized");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [thumbnail, setThumbnail] = useState();
  const [content, setContent] = useState();
  const [slug, setSlug] = useState("");

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [articleLoaded, setArticleLoaded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  useEffect(() => {
    Axios.get("/article/category").then((response) => {
      setCategories(response.data);
      setCategoriesLoaded(true);
    });
    Axios.get("/article/" + id).then((response) => {
      setArticleId(response.data.data.id);
      setCategory(response.data.data.category);
      setTitle(response.data.data.title);
      setSubtitle(response.data.data.subtitle);
      setThumbnail(response.data.data.thumbnail_url);
      setContent(response.data.data.content);
      setSlug(response.data.data.slug);
      setArticleLoaded(true);
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
        setThumbnail(response.data.url);
        handleSnackbarOpen("File uploaded.");
      })
      .catch((error) => {
        console.log(error.response);
        handleSnackbarOpen("File upload failed, please refresh this page!");
      });
  };

  const handleUpdateArticle = () => {
    if (!title || !subtitle || !content || !thumbnail || !category) {
      setTimeout(
        () => handleSnackbarOpen("Please fill all the required section!"),
        500
      );
    } else {
      Axios.patch(
        "/article/" + articleId,
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
            "The article has been updated, redirecting to menu..."
          );
          setTimeout(() => setRedirect("/article"), 2000);
        })
        .catch((error) => {
          console.log(error.response);
          handleSnackbarOpen("Failed to update article.");
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

  if (!articleLoaded && !categoriesLoaded)
    return (
      <MiniDrawer>
        <LoadingData />
      </MiniDrawer>
    );

  return (
    <MiniDrawer title="Edit Article">
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <TextField
            label="Title"
            value={title}
            variant="outlined"
            size="small"
            style={classes.mb}
            fullWidth
            onChange={handleTitleChange}
          />
          <TextField
            label="Subtitle"
            value={subtitle}
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
            data={content}
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
                onClick={handleUpdateArticle}
              >
                Update
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
            <img
              src={
                process.env.REACT_APP_API_URL + "/storage/article/" + thumbnail
              }
              width="100%"
              style={{ maxHeight: 200 }}
            />
            <input
              type="file"
              onChange={uploadThumbnail}
              accept="image/png, image/jpeg"
            />

            <Typography variant="subtitle2" style={classes.mt}>
              <b>Category</b>
            </Typography>
            <form>
              {categories.map((cat) => {
                return (
                  <React.Fragment key={cat.id}>
                    {cat.id == category ? (
                      <input
                        type="radio"
                        id={cat.id}
                        name="category"
                        value={cat.id}
                        onClick={handleCategoryChange}
                        defaultChecked
                      />
                    ) : (
                      <input
                        type="radio"
                        id={cat.id}
                        name="category"
                        value={cat.id}
                        onClick={handleCategoryChange}
                      />
                    )}

                    <label htmlFor={cat.id}>{cat.name}</label>
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
              value={slug}
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
