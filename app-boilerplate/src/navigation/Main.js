import React from "react";
import { AsyncStorage } from "react-native";
import Drawer from "./DrawerNavigator";
import CenterSpinner from "../screens/components/Util/CenterSpinner";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

const makeApolloClient = token => {
  const link = new HttpLink({
    uri: "https://learn.hasura.io/graphql",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const cache = new InMemoryCache();

  const client = new ApolloClient({
    link,
    cache
  });
  return client;
};

console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    client: null
  };

  // bootstrap session in componentDidMount
  async componentDidMount() {
    // fetch session
    const session = await AsyncStorage.getItem("@todo-graphql:session");
    const sessionObj = JSON.parse(session);
    const { token, id } = sessionObj;
    const client = makeApolloClient(token);
    this.setState({
      client
    });
  }

  render() {
    if (!this.state.client) {
      return <CenterSpinner />;
    }
    return (
      <ApolloProvider client={this.state.client}>
        <Drawer />
      </ApolloProvider>
    );
  }
}
