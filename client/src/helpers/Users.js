// GRAPHQL
import graphqlClient from "../graphql";
import { GET_USER_OPTIONS_QUERY } from "../graphql/query";

const onSuggestionsFetchRequested = async value => {
  try {
    if (value !== "") {
      setFetching(true);
      const { data } = await graphqlClient.query({
        query: GET_USER_OPTIONS_QUERY,
        variables: { keyword: value }
      });
      const options = data.getUserList.map(item => {
        return {
          name: `${item.given_name} ${item.family_name}`,
          value: item.email,
          id: item.id
        };
      });
      return options;
    }
    return [];
  } catch (err) {
    console.log("onSuggestionsFetchRequested error", err);
  }
};

export { onSuggestionsFetchRequested };
