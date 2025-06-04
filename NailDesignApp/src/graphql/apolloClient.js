import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { fetchAuthSession } from "aws-amplify/auth";

// HTTP Link for queries and mutations
const httpLink = new HttpLink({
  uri: "https://25ghz7i5pvfvdb6shrscoefuky.appsync-api.us-west-2.amazonaws.com/graphql",
});

// Auth link to attach JWT
const authLink = setContext(async (_, { headers }) => {
  const token = (await fetchAuthSession()).tokens?.idToken?.toString();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Apollo client with HTTP only (subscriptions disabled for now)
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getMessagesByChat: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;

