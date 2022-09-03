// const { ApolloServer, gql } = require('apollo-server');
import {ApolloServer, gql} from "apollo-server"

// The GraphQL schema - Docs(문서) 만들어 주는 부분
const typeDefs = gql`
  type Query {
    fetchBoards: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = { // resolvers 가 api라고 함.
  Query: {
    // hello: () => 'world',
    fetchBoards: () => {
        return "world"
    },
  },
//   Mutation: {
//     createQqq: () => {

//     }
//   }
};

const app = new ApolloServer({
  typeDefs,
  resolvers,
});

app.listen(3000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});