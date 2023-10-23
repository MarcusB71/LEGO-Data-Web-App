const setData = require('../data/setData');
const themeData = require('../data/themeData');

let sets = [];
const initialize = () => {
  return new Promise((res, rej) => {
    try {
      setData.forEach((set) => {
        const newTheme = themeData.find((data) => set.theme_id === data.id);
        set.theme = newTheme.name;
        sets.push({ ...set });
      });
      res();
    } catch {
      rej('unable to initialize sets array');
    }
  });
};
const getAllSets = () => {
  return new Promise((res, rej) => {
    if (sets.length > 0) {
      res(sets);
    } else {
      rej('no sets found');
    }
  });
};

const getSetByNum = (setNum) => {
  return new Promise((res, rej) => {
    const setByNum = sets.filter((set) => set.set_num == setNum);
    if (setByNum.length > 0) {
      res(setByNum);
    } else {
      rej('no matching set nums');
    }
  });
};
const getSetsByTheme = (theme) => {
  return new Promise((res, rej) => {
    const setByTheme = sets.filter((set) =>
      set.theme.toUpperCase().includes(theme.toUpperCase())
    );
    if (setByTheme.length > 0) {
      res(setByTheme);
    } else {
      rej('no matching themes');
    }
  });
};
module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
};
// initialize();
// console.log(getAllSets());
// console.log(getSetByNum('00-1'));
// console.log(getSetsByTheme('Technic'));
