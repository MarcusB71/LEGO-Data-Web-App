require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);
const Theme = sequelize.define(
  'Theme',
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);
const Set = sequelize.define(
  'Set',
  {
    set_num: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);
Set.belongsTo(Theme, { foreignKey: 'theme_id' });

const initialize = () => {
  return new Promise((res, rej) => {
    try {
      sequelize.sync().then(() => {
        res();
      });
    } catch (err) {
      rej(err);
    }
  });
};
const getAllSets = () => {
  return new Promise((res, rej) => {
    sequelize.sync().then(() => {
      Set.findAll({
        include: [Theme],
      })
        .then((sets) => {
          res(sets);
        })
        .catch((err) => {
          rej(err);
        });
    });
  });
};
const getSetByNum = (setNum) => {
  return new Promise((res, rej) => {
    sequelize.sync().then(() => {
      Set.findAll({
        where: {
          set_num: setNum,
        },
        include: [Theme],
      })
        .then((set) => {
          res(set[0]);
        })
        .catch((err) => {
          rej(err);
        });
    });
  });
};
const getSetsByTheme = (theme) => {
  return new Promise((res, rej) => {
    sequelize.sync().then(() => {
      Set.findAll({
        include: [Theme],
        where: {
          '$Theme.name$': {
            [Sequelize.Op.iLike]: `%${theme}%`,
          },
        },
      })
        .then((set) => {
          res(set);
        })
        .catch((err) => {
          rej(err);
        });
    });
  });
};
const getAllThemes = () => {
  return new Promise((res, rej) => {
    sequelize.sync().then(() => {
      Theme.findAll()
        .then((themes) => {
          res(themes);
        })
        .catch((err) => {
          rej(err);
        });
    });
  });
};
const addSet = (setData) => {
  return new Promise((res, rej) => {
    sequelize.sync().then(() => {
      Set.create({
        set_num: setData.set_num,
        name: setData.name,
        year: setData.year,
        num_parts: setData.num_parts,
        theme_id: setData.theme_id,
        img_url: setData.img_url,
      })
        .then(() => {
          res();
        })
        .catch((err) => {
          rej(err.errors[0].message);
        });
    });
  });
};
const editSet = (setNum, setData) => {
  console.log(setData);
  console.log(setNum);
  return new Promise((res, rej) => {
    sequelize.sync().then(() => {
      console.log('setnum: ', setNum);
      Set.update(
        {
          // set_num: setData.set_num,
          name: setData.name,
          year: setData.year,
          num_parts: setData.num_parts,
          theme_id: setData.theme_id,
          img_url: setData.img_url,
        },
        {
          where: { set_num: setNum },
        }
      )
        .then(() => {
          res();
        })
        .catch((err) => {
          rej(err.errors[0].message);
        });
    });
  });
};
const deleteSet = (setNum) => {
  return new Promise((res, rej) => {
    sequelize.sync().then(() => {
      Set.destroy({
        where: { set_num: setNum },
      })
        .then(() => {
          res();
        })
        .catch((err) => {
          rej(err.errors[0].message);
        });
    });
  });
};
module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  getAllThemes,
  addSet,
  editSet,
  deleteSet,
};
