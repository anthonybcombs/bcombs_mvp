import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
console.log("process.env.API_HOST_GRAPHQL", process.env.API_HOST_GRAPHQL);
export default new ApolloClient({
  link: new HttpLink({
    uri: process.env.API_HOST_GRAPHQL,
    credentials: "same-origin"
  }),
  cache: new InMemoryCache({
    addTypename: false
  })
});
