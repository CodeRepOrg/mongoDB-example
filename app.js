/* eslint-disable no-console */
/* eslint-disable no-process-env */
/* eslint-disable prettier/prettier */
// const winston = require('winston');
const mongoose = require('mongoose');
const model = require('./user.model');

// set up config
const express = require('express');
const { send } = require('process');
const app = express();
// const config = require('./config');
require('dotenv').config();

app.set('superSecret', process.env.superSecret);

// function unicodeToChar(text) {
//   return text.replace(/\\u[\dA-F]{4}/gi, 
//       function (match) {
//           return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
//       });
// }

/*
var cfenv = require('cfenv'),// Cloud Foundry Environment Variables
    appEnv = cfenv.getAppEnv();// Grab environment variables

var mongoDbUrl, mongoDbOptions = {};
var mongoDbCredentials = appEnv.services["databases-for-mongodb"][0].credentials.connection.mongodb;
var ca = Buffer.from(mongoDbCredentials.certificate.certificate_base64, 'base64');
mongoDbUrl = mongoDbCredentials.composed[0];
mongoDbOptions = {
    useNewUrlParser: true,
    ssl: true,
    sslValidate: true,
    sslCA: ca,
    poolSize: 1,
    reconnectTries: 1,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
};

console.log("Your MongoDB is running at ", mongoDbUrl);
// connect to our database
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(unicodeToChar(mongoDbUrl), mongoDbOptions)
    .then(res => console.log("Connected to mongodb instance."))
    .catch(function (reason) {
        console.log('Unable to connect to the mongodb instance. Error: ', reason);
    });
sessionDB = mongoDbUrl;
*/

const mongoOptions = {
    useNewUrlParser: true,
    dbName: 'eagle-dev',
    poolSize: 1,
    autoIndex: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate: true,
    sslCA: require('fs').readFileSync(`${__dirname}/cert.pem`)
  }
console.log(process.env.DATABASE)
mongoose.connect(process.env.DATABASE, mongoOptions)
    .then(res => console.log("Connected to mongodb instance."))
    .catch(function (reason) {
        console.log('Unable to connect to the mongodb instance. Error: ', reason);
    });
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected!');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected!');
});
mongoose.connection.on('error', (err) => {
  console.log('Mongoose Error!', err.message);
});

app.get('/test', (req, res) => {
    model.insertMany([{
        name: 'jp'
    }])
    .then(d => {
        res.send({
            inserted: 'ok'
        })
    })
    .catch(err => {
        res.send(err);
    });
});
app.get('/', (req, res) => {
    model.find({name: 'jp'})
        .then(d => {
            res.send(d)
        })
        .catch(err => {
            res.send(err);
        })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is running on port ${ PORT }`);
});
