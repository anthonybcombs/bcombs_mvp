import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
export default new ApolloClient({
  link: new HttpLink({
    uri: `http://localhost:3001/graphql`,
    credentials: "same-origin",
  }),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
