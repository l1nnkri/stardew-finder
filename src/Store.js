import { createConnectedStore, withReduxDevtools } from 'undux';

// Create a store with an initial value.
const store = createConnectedStore(
  {
    locations: {},
    gameState: {},
    info: {},
    deliverableItems: {},
  },
  withReduxDevtools
);

export default store;
