var express = require('express')
var app = express()
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const routes = require('./routes')
var cors = require('cors')
const bodyParser = require('body-parser')

var port = process.env.PORT || 3400;
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

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.use('/api', routes)
app.listen(port, function()
{console.log(`Server is listening on port 3400`)})
module.exports = app;