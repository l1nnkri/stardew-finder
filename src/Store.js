import { createConnectedStore, withReduxDevtools } from 'undux';

// Create a store with an initial value.
export default createConnectedStore(
  {
    locations: {},
    gameState: {},
    info: {},
  },
  withReduxDevtools
);
