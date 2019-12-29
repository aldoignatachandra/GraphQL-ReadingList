import React, { useState } from "react";
import { graphql } from "react-apollo";
import { getBooksQuery } from "../queries/queries";

//Components
import BookDetails from "./BookDetails";

const BookList = ({ data }) => {
  const [selected, setSelected] = useState(null);

  const displayBook = () => {
    if (data.loading) {
      return (
        <div>
          <p align="center">Loading Books.....</p>
        </div>
      );
    } else {
      return data.books.map(book => {
        return (
          <li
            key={book.id}
            onClick={e => {
              setSelected(book.id);
            }}
          >
            {book.name}
          </li>
        );
      });
    }
  };

  return (
    <div>
      <ul id="book-list">{displayBook()}</ul>
      <BookDetails bookId={selected} />
    </div>
  );
};

export default graphql(getBooksQuery)(BookList);
