import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Reset from "./machine";

const GET_TARGET_VALUE = gql`
  query {
    value: getNewValue @client
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.reset = new Reset({
      begin: () => this.setState(this.getInitialState()),
      end: () => this.setState(this.getInitialState())
    });
  }
  getInitialState() {
    return { counter: 0, enabled: false };
  }
  render() {
    return (
      <Query query={GET_TARGET_VALUE}>
        {({ data, loading, error }) => {
          if (loading) return <p>LOADING</p>;
          if (error)
            return (
              <div>
                <p>ERROR!</p>
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </div>
            );
          return (
            <div>
              <div>goal: {data.value}</div>
              <div>current: {this.state.counter}</div>
              <button onClick={() => this.incrementState()}>Inc</button>
              <button
                onClick={() =>
                  this.setState({ counter: this.state.counter - 1 })
                }
              >
                Dec
              </button>
            </div>
          );
        }}
      </Query>
    );
  }

  incrementState() {
    this.setState({ counter: this.state.counter + 1 });
  }
}

export default App;
