import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

const DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};
export default new ApolloClient({
  link: new HttpLink({
    uri: process.env.API_HOST_GRAPHQL,
    credentials: "same-origin",
  }),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: DefaultOptions,
});
