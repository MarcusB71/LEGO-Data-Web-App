/*********************************************************************************
 * WEB322 – Assignment 03
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html*
 *
 * Name: Marcus Brown Student ID: 127900223 Date: 2023-10-23
 *
 * Published URL:
 *
 **********************************************************************************/
const legoData = require('./modules/legoSets');
const path = require('path');
const express = require('express');
const app = express();
const HTTP_PORT = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/lego/sets', async (req, res) => {
  try {
    if (req.query.theme) {
      const idSets = await legoData.getSetsByTheme(req.query.theme);
      res.send(idSets);
    } else {
      const allSets = await legoData.getAllSets();
      res.send(allSets);
    }
  } catch (err) {
    console.log(err);
  }
});
app.get('/lego/sets/:id', async (req, res) => {
  try {
    const idSets = await legoData.getSetByNum(req.params.id);
    res.send(idSets);
  } catch (err) {
    console.log(err);
  }
});
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});
async function startServer() {
  await legoData.initialize();
  app.listen(HTTP_PORT, () => {
    console.log(`server listening on ${HTTP_PORT}`);
  });
}
startServer();
