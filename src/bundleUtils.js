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
