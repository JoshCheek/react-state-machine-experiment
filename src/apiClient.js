import ApolloClient from "apollo-boost"
const resolveAfter = (delay, value) =>
  new Promise((resolve, reject) =>
    setTimeout(() => resolve(value), delay))

// inclusive
const randomNumberBetween = (low, high) =>
  low + Math.floor((1+high-low) * Math.random())

const getNewValue = () =>
  resolveAfter(2000, randomNumberBetween(1, 10))

const client = new ApolloClient({
  clientState: { resolvers: { Query: { getNewValue } } }
})

export default client
