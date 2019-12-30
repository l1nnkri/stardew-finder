import bundles from './data/bundles.json';

export const ROOMS = {
  0: {
    name: 'Pantry',
    bundles: {
      0: 'Spring Crops',
      1: 'Summer Crops',
      2: 'Fall Crops',
      3: 'Quality Crops',
      4: 'Animal',
      5: 'Artisan',
    },
  },
  1: {
    name: 'Crafts Room',
    bundles: {
      13: 'Spring Foraging',
      14: 'Summer Foraging',
      15: 'Fall Foraging',
      16: 'Winter Foraging',
      17: 'Construction',
      19: 'Exotic Foraging',
    },
  },
  2: {
    name: 'Fish Tank',
    bundles: {
      6: 'River Fish',
      7: 'Lake Fish',
      8: 'Ocean Fish',
      9: 'Night Fishing',
      10: 'Specialty Fish',
      11: 'Crab Pot',
    },
  },
  3: {
    name: 'Boiler Room',
    bundles: {
      20: "Blacksmith's",
      21: "Geologist's",
      22: "Adventurer's",
    },
  },
  4: {
    name: 'Vault',
    bundles: {
      23: ' 2,500g',
      24: ' 5,000g',
      25: '10,000g',
      26: '25,000g',
    },
  },
  5: {
    name: 'Bulletin Board',
    bundles: {
      31: "Chef's",
      32: 'Field Research',
      33: "Enchanter's",
      34: 'Dye',
      35: 'Fodder',
    },
  },
};

const BUNDLE_COUNT = {
  // number of items in each bundle
  0: 4,
  1: 4,
  2: 4,
  3: 3,
  4: 5,
  5: 6,
  6: 4,
  7: 4,
  8: 4,
  9: 3,
  10: 4,
  11: 5,
  13: 4,
  14: 3,
  15: 4,
  16: 4,
  17: 4,
  19: 5,
  20: 3,
  21: 4,
  22: 2,
  23: 1,
  24: 1,
  25: 1,
  26: 1,
  31: 6,
  32: 4,
  33: 4,
  34: 6,
  35: 3,
};

export const getBundleStatus = gameState => {
  const ccLoc = gameState.locations.GameLocation.find(
    c => c.name === 'CommunityCenter'
  );

  const bundlesHave = ccLoc.bundles.item.reduce((p, item) => {
    const id = item.key.int;
    const count = item.value.ArrayOfBoolean.boolean.reduce((p, c) => p + c, 0);
    p[id] = count;
    return p;
  }, {});

  const stateBundles = ccLoc.bundles.item;
  const missing = Object.keys(bundles).reduce((p, bundleKey) => {
    const rawBundle = bundles[bundleKey];
    const bundle = stateBundles.find(b => +b.key.int === +rawBundle.id);
    const booleanArray = bundle.value.ArrayOfBoolean.boolean;
    const missingIngredients = rawBundle.ingredients.reduce((p, c, i) => {
      if (booleanArray[i]) {
        return p;
      }
      return [...p, c];
    }, []);
    p[bundleKey] = {
      missingIngredients,
      nMissing: Math.max(BUNDLE_COUNT[bundleKey] - bundlesHave[bundleKey], 0),
    };
    return p;
  }, {});
  return missing;
};

const findPaths = (
  obj,
  searchValue,
  { searchKeys = typeof searchValue === 'string', maxDepth = 20 } = {}
) => {
  const paths = [];
  const notObject = typeof searchValue !== 'object';
  const gvpio = (obj, maxDepth, prefix) => {
    if (!maxDepth) return;

    for (const [curr, currElem] of Object.entries(obj)) {
      if (searchKeys && curr === searchValue) {
        // To search for property name too ...
        paths.push(prefix + curr);
      }

      if (typeof currElem === 'object') {
        // object is "object" and "array" is also in the eyes of "typeof"
        // search again :D
        gvpio(currElem, maxDepth - 1, prefix + curr + '/');
        if (notObject) continue;
      }
      // it's something else... probably the value we are looking for
      // compares with "searchValue"
      if (currElem === searchValue) {
        // return index AND/OR property name
        paths.push(prefix + curr);
      }
    }
  };
  gvpio(obj, maxDepth, '');
  return paths;
};

export const getDeliverableItems = gameState => {
  // Find player inventory
  const playerItems = gameState.player.items.Item.filter(
    item => item['@_xsi:nil'] !== true
  ).map(item => ({
    name: item.name,
    stack: item.stack,
    id: item.parentSheetIndex,
    quality: item.quality,
  }));

  // Find farmhands inventory
  const farmhands = findPaths(gameState, 'farmhand').map(path =>
    path.split('/').reduce((p, c) => p[c], gameState)
  );

  const farmhandItems = farmhands
    .map(farmhand => {
      const items = farmhand.items.Item;
      return items
        .filter(item => item['@_xsi:nil'] !== true)
        .map(item => ({
          name: item.name,
          stack: item.stack,
          id: item.parentSheetIndex,
          quality: item.quality,
        }));
    })
    .reduce((p, c) => [...p, ...c], []);

  // Find all chests
  const chestItems = findPaths(gameState, 'playerChest')
    .map(path =>
      path
        .split('/')
        .slice(0, -1)
        .reduce((p, c) => p[c], gameState)
    )
    .map(chest => (chest.items === '' ? [] : chest.items.Item))
    .filter(chest => chest.length > 0)
    .map(chest =>
      chest.map(item => ({
        name: item.name,
        stack: item.stack,
        id: item.parentSheetIndex,
        quality: item.quality,
      }))
    )
    .reduce((p, c) => [...p, ...c], []);

  return [...playerItems, ...farmhandItems, ...chestItems].reduce((p, c) => {
    const key = c.id;
    const current = p[key];
    if (!current || current.length === 0) {
      p[key] = [c];
    } else {
      p[key] = [...p[key], c];
    }
    return p;
  }, {});
};

export const canDeliverItem = (deliverableItems, itemId, stack, quality) => {
  const items = deliverableItems[itemId] || [];
  if (
    items.reduce((p, c) => {
      if (c.quality >= quality) {
        return p + c.stack;
      }
      return p;
    }, 0) >= stack
  ) {
    return true;
  }
  return false;
};
