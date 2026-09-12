const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Demo app listening on port ${PORT}`);
});
