const express = require('express');
const os = require('os');

const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from NodeJS web app!',
    hostname: os.hostname(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/healthz', (req, res) => {
  res.status(200).send('ok');
});

module.exports = app;