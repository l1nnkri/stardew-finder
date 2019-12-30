const Recipes = require('./CraftingRecipes.json');

const a = Object.keys(Recipes.content).reduce((p, key) => {
  const name = key;
  const splitted = Recipes.content[key].split('/');
  const itemId = +splitted[2].split(' ')[0];
  p[itemId] = name;
  return p;
}, {});

console.log(JSON.stringify(a));
