const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Server');
});

app.get('/about', (req, res) => {
  res.send('Hello, about');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
