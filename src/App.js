import React, { Component } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Reset } from "./machines"

const GET_TARGET_VALUE = gql`
  query { value: getNewValue @client }
`

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { enabled: false, counter: 0  }
    this.reset = new Reset({
      begin: () => this.setState({ enabled: false }),
      end:   () => this.setState({ enabled: true, counter: 0 }),
    })
  }

  componentDidMount() { this.reset.begin() }

  render() {
    return <Query query={GET_TARGET_VALUE}>
      {({ data, loading, error, refetch }) => {
        // kinda interesting to see:
        // console.log(this.reset.stateMachine.state)

        loading || this.reset.end()

        return this.reset.isLoading() ? this.renderInitialLoadScreen() :
               error                  ? this.renderError(error) :
                                        this.renderData(data, refetch)
      }}
    </Query>
  }

  renderInitialLoadScreen() {
    return <p>LOADING</p>
  }

  renderError(error) {
    return <div>
      <p>ERROR!</p>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  }

  renderData(data, refetch) {
    const { counter, enabled } = this.state
    const target    = data.value
    const buttonFor = (text, newCounter) => {
      const onClick = () => this.update(target, newCounter, refetch)
      return <button disabled={!enabled} onClick={onClick}>
        { text }
      </button>
    }

    return <div>
      <p>{counter} of {target}</p>
      { buttonFor('Dec', counter-1) }
      { buttonFor('Inc', counter+1) }
    </div>
  }

  update(target, counter, refetch) {
    this.setState({ counter })
    if (counter === target) {
      refetch()
      this.reset.begin()
    }
  }
}

export default App
