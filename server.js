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
 * Published URL: https://ruby-wide-eyed-goshawk.cyclic.app/
 *
 **********************************************************************************/
const legoData = require('./modules/legoSets');
const path = require('path');
const express = require('express');
const app = express();
const HTTP_PORT = 8080;

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/lego/sets', async (req, res) => {
  try {
    if (req.query.theme) {
      const allSets = await legoData.getSetsByTheme(req.query.theme);
      res.render('sets', { allSets: allSets });
    } else {
      const allSets = await legoData.getAllSets();
      res.render('sets', { allSets: allSets });
    }
  } catch (err) {
    res
      .status(404)
      .render('404', { message: 'No Sets found for a matching theme' });
  }
});
app.get('/lego/sets/:id', async (req, res) => {
  try {
    const idSets = await legoData.getSetByNum(req.params.id);
    res.render('set', { set: idSets });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .render('404', { message: 'No Sets found for a specific set num' });
  }
});
app.use((req, res) => {
  res.status(404).render('404', {
    message: 'No view matched for a specific route',
  });
});
async function startServer() {
  await legoData.initialize();
  app.listen(HTTP_PORT, () => {
    console.log(`server listening on ${HTTP_PORT}`);
  });
}
startServer();
