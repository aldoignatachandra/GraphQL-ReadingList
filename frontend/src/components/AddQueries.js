import React, { useState } from "react";
import { graphql } from "react-apollo";
import compose from "lodash.flowright";
import {
  addBookMutation,
  addAuthorMutation,
  getBooksQuery,
  getAuthorsQuery
} from "../queries/queries";
import "../styles/AddBookStyle.css";
import { Snackbar, SnackbarContent } from "@material-ui/core";
import { amber, green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

const MySnackbarContentWrapper = props => {
  const classes = useStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
    />
  );
};

const AddQueries = ({
  getAuthorsQuery,
  addBookMutation,
  addAuthorMutation
}) => {
  //State To Add New Book
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [authorId, setAuthorId] = useState("");

  //State To Add New Author
  const [authorName, setAuthorName] = useState("");
  const [authorAge, setAuthorAge] = useState(0);

  //State To Change Form
  const [currentForm, setCurrentForm] = useState("book");

  //State For Snackbar
  const [message, setMessage] = useState("");
  const [type, setType] = useState("warning");
  const [open, setOpen] = useState(false);

  const snackbar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      >
        <MySnackbarContentWrapper variant={type} message={message} />
      </Snackbar>
    );
  };

  const showSnackbar = (open, type, message) => {
    setOpen(open);
    setType(type);
    setMessage(message);
  };

  const displayAuthors = () => {
    var data = getAuthorsQuery;
    if (data.loading) {
      return <option disabled>Loading Authors.....</option>;
    } else {
      return data.authors.map(author => {
        return (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        );
      });
    }
  };

  const changeForm = () => {
    if (currentForm === "book") {
      setAuthorName("");
      setAuthorAge(0);
      setCurrentForm("author");
    } else {
      setName("");
      setGenre("");
      setAuthorId("");
      setCurrentForm("book");
    }
  };

  //Capitalize First Letter Of Each Word In A String
  const capitalizeName = name => {
    var splitStr = name.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    setName(splitStr.join(" "));
  };

  const submitFormBook = e => {
    e.preventDefault();
    setOpen(true);
    //Add Book Validation
    if (name === "") {
      showSnackbar(true, "warning", "Book Name Connot Be Empty");
    } else if (genre === "") {
      showSnackbar(true, "warning", "Genre Cannot Be Empty");
    } else if (authorId === "") {
      showSnackbar(true, "warning", "Author ID Connot Be Empty");
    } else {
      showSnackbar(true, "success", "Success Add New Book");
      addBookMutation({
        variables: {
          name: name,
          genre: genre,
          authorId: authorId
        },
        refetchQueries: [{ query: getBooksQuery }]
      });
    }
  };

  const submitFormAuthor = e => {
    e.preventDefault();

    //Add Author Validation
    if (authorName === "") {
      showSnackbar(true, "warning", "Author Name Cannot Be Empty");
    } else if (authorAge < 0 || authorAge > 100) {
      showSnackbar(true, "warning", "Author Age Must Be In Range 0 - 100");
    } else {
      showSnackbar(true, "success", "Success Add New Author");
      addAuthorMutation({
        variables: {
          name: authorName,
          age: authorAge
        }
      });
    }
  };

  const form = () => {
    if (currentForm === "book") {
      return (
        <form id="add-book" onSubmit={submitFormBook}>
          <div className="field">
            <label>Book Name : </label>
            <input
              type="text"
              onChange={e => capitalizeName(e.target.value)}
              maxLength="50"
              value={name}
            />
          </div>

          <div className="field">
            <label>Genre : </label>
            <input
              type="text"
              onChange={e => setGenre(e.target.value)}
              maxLength="30"
              value={genre}
            />
          </div>

          <div className="field">
            <label>Author : </label>
            <select onChange={e => setAuthorId(e.target.value)}>
              <option>Select Author</option>
              {displayAuthors()}
            </select>
          </div>
          <button>+</button>
        </form>
      );
    } else {
      return (
        <form id="add-book" onSubmit={submitFormAuthor}>
          <div className="field">
            <label>Author Name : </label>
            <input
              type="text"
              onChange={e => setAuthorName(e.target.value)}
              maxLength="50"
              value={authorName}
            />
          </div>

          <div className="field">
            <label>Age : </label>
            <input
              type="number"
              onChange={e => setAuthorAge(parseInt(e.target.value))}
              min="0"
              value={authorAge}
            />
          </div>

          <button>+</button>
        </form>
      );
    }
  };

  return (
    <>
      {snackbar()}
      {form()}
      <button className="change-form" onClick={changeForm}>
        Change Form
      </button>
    </>
  );
};

export default compose(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
  graphql(addBookMutation, { name: "addBookMutation" }),
  graphql(addAuthorMutation, { name: "addAuthorMutation" })
)(AddQueries);
