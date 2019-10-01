var express = require('express')
var app = express()
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const routes = require('./routes')
var cors = require('cors')
const bodyParser = require('body-parser')


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use(cors());
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
app.use(bodyParser.json())

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.use('/api', routes)
app.listen(3400, function()
{console.log(`Server is listening on port 3400`)})
module.exports = app;