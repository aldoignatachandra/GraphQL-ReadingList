import React from "react";
import { graphql } from "react-apollo";
import { getBookQuery } from "../queries/queries";
import "../styles/BookDetailsStyle.css";

const BookDetails = ({ data }) => {
  const displayBookDetails = () => {
    if (data.book) {
      return (
        <div>
          <h2>{data.book.name}</h2>
          <p>{data.book.genre}</p>
          <p>
            {data.book.author.name} ({data.book.author.age})
          </p>
          <p>All Books by This Author : </p>
          <ul className="other-books">
            {data.book.author.books.map(item => {
              return <li key={item.id}>{item.name}</li>;
            })}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="empty">
          <p align="center">No Book Selected</p>
          <img
            className="icon"
            src={require("../assets/images/Book.png")}
            alt="Book Icon"
          />
        </div>
      );
    }
  };

  return <div id="book-details">{displayBookDetails()}</div>;
};

export default graphql(getBookQuery, {
  options: ({ bookId }) => {
    return {
      variables: {
        id: bookId
      }
    };
  }
})(BookDetails);
