import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import "../src/styles/index.css";

//Component
import BookList from "./components/BookList";
import AddQueries from "./components/AddQueries";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div id="main">
        <h1>Ignata's Reading List</h1>
        <BookList />
        <AddQueries />
      </div>
    </ApolloProvider>
  );
};

export default App;
