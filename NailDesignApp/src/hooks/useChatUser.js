import { useQuery } from "@apollo/client";
import { useUser } from "../context/userContext";
import { GET_USER_CHATS } from "../graphql/chatQueries";

export const useChatUser = (enableQuery = true) => {
  const { user } = useUser();
  const userId = user?.sub;

  const { data, loading, error, refetch } = useQuery(GET_USER_CHATS, {
    variables: { user_id: userId },
    skip: !userId || !enableQuery,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    pollInterval: enableQuery ? 5000 : 0,
    onError: (apolloError) => {
      console.error("=== GET_USER_CHATS ERROR ===");
      console.error("Error object:", JSON.stringify(apolloError, null, 2));
      console.error("Error message:", apolloError.message);
      console.error("GraphQL errors:", apolloError.graphQLErrors);
      console.error("Network error:", apolloError.networkError);
      console.error("Variables used:", { user_id: userId });
      console.error("============================");
    },
    onCompleted: (queryData) => {
      console.log("=== GET_USER_CHATS SUCCESS ===");
      console.log("Query completed successfully");
      console.log("Data received:", JSON.stringify(queryData, null, 2));
      console.log("Number of chats:", queryData?.getUserChats?.length || 0);
      console.log("==============================");
    }
  });

  return {
    chats: data?.getUserChats || [],
    loading,
    error,
    refetch,
    user,
    userId
  };
};