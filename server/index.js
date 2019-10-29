var express = require('express')
var app = express()
const routes = require('./routes')
var cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

var port = process.env.PORT || 3400;

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser())

mongoose.connect(`mongodb+srv://joshsauder:${process.env.MONGODB_KEY}@birdhouse1-ipdrb.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true,})
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
    console.log(err)
})

app.use('/api', routes)
app.listen(port, function()
{console.log(`Server is listening on port ${port}`)})
module.exports = app;