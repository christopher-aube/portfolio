const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const path = require('path');

const basePublicPath = './public';
const viewEngine = 'hbs';
const appPage = path.join(__dirname + '/public/index.html');
const notFoundPage = path.join(__dirname + '/public/404.html');

const fbApp = firebase.initializeApp(
    functions.config.firebase
);

const app = express();

app.engine(viewEngine, engines.handlebars);
app.set('views', basePublicPath);
app.set('view engine', viewEngine);
app.set('json spaces', 4);

function sendStatic(req, res) {
    res.sendFile(path.join(__dirname + req.url));
}

function sendApp(req, res) {
    res.sendFile(appPage);
}

// allow access to assets
app.get('/public/*', sendStatic);

// send app page
app.get('/', sendApp);

exports.app = functions.https.onRequest(app);