/*********************************************************************************
 * WEB322 – Assignment 05
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html*
 *
 * Name: Marcus Brown Student ID: 127900223 Date: 2023-11-25
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

app.get(
  '/lego/addSet',
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      const themeData = await legoData.getAllThemes();
      res.render('addSet', { themes: themeData });
    } catch (err) {
      res.render('500', { message: 'Database error' });
    }
  }
);
app.post(
  '/lego/addSet',
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      await legoData.addSet(req.body);
      res.redirect('/lego/sets');
    } catch (err) {
      res.render('500', {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    }
  }
);
app.get(
  '/lego/editSet/:num',
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      const setData = await legoData.getSetByNum(req.params.num);
      const themeData = await legoData.getAllThemes();
      res.render('editSet', { themes: themeData, set: setData });
    } catch (err) {
      res.status(404).render('404', { message: err });
    }
  }
);
app.post(
  '/lego/editSet',
  express.urlencoded({ extended: true }),
  async (req, res) => {
    console.log(req.body);
    try {
      await legoData.editSet(req.body.set_num, req.body);
      res.redirect('/lego/sets');
    } catch (err) {
      res.render('500', {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    }
  }
);
app.get(
  '/lego/deleteSet/:num',
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      await legoData.deleteSet(req.params.num);
      res.redirect('/lego/sets');
    } catch (err) {
      res.render('500', {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    }
  }
);
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

// const Sequelize = require('sequelize');

// // set up sequelize to point to our postgres database
// const sequelize = new Sequelize('LegoDB', 'MarcusB71', 'ah7p4KlCQWRb', {
//   host: 'ep-royal-breeze-51150742-pooler.us-east-2.aws.neon.tech',
//   dialect: 'postgres',
//   port: 5432,
//   dialectOptions: {
//     ssl: { rejectUnauthorized: false },
//   },
// });

// // Define a "Project" model
// const Project = sequelize.define(
//   'Project',
//   {
//     project_id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true, // use "project_id" as a primary key
//       autoIncrement: true, // automatically increment the value
//     },
//     title: Sequelize.STRING,
//     description: Sequelize.TEXT,
//   },
//   {
//     createdAt: false, // disable createdAt
//     updatedAt: false, // disable updatedAt
//   }
// );
// Define our "User" and "Task" models

// const User = sequelize.define('User', {
//   fullName: Sequelize.STRING, // the user's full name (ie: "Jason Bourne")
//   title: Sequelize.STRING, // the user's title within the project (ie, developer)
// });

// const Task = sequelize.define('Task', {
//   title: Sequelize.STRING, // title of the task
//   description: Sequelize.TEXT, // main text for the task
// });

// // Associate Tasks with user & automatically create a foreign key
// // relationship on "Task" via an automatically generated "UserId" field

// User.hasMany(Task);
// // synchronize the Database with our models and automatically add the
// // table if it does not exist

// sequelize.sync().then(() => {
//   // Create user "Jason Bourne"
//   User.create({
//     fullName: 'Jason Bourne',
//     title: 'developer',
//   }).then((user) => {
//     console.log('user created');

//     // Create "Task 1" for the new user
//     Task.create({
//       title: 'Task 1',
//       description: 'Task 1 description',
//       UserId: user.id, // set the correct Userid foreign key
//     }).then(() => {
//       console.log('Task 1 created');
//     });

//     // Create "Task 2" for the new user
//     Task.create({
//       title: 'Task 2',
//       description: 'Task 2 description',
//       UserId: user.id, // set the correct Userid foreign key
//     }).then(() => {
//       console.log('Task 2 created');
//     });
//   });
// });
