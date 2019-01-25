import ApolloClient from "apollo-boost";
const slowness = 1000; // ms
const size = 10;

const resolveSlowly = value =>
  new Promise((resolve, reject) => setTimeout(() => resolve(value), slowness));

const getNewValue = () => resolveSlowly(Math.floor(size * Math.random()));

const client = new ApolloClient({
  clientState: { resolvers: { Query: { getNewValue } } }
});

export default client;
