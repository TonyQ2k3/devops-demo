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

// Tự động crash app khi truy cập (simulate app error)
app.get('/crash', (req, res) => {
  res.status(500).send('App is failing...');
  console.error('This is a code error!');
  process.exit(1);
});

module.exports = app;