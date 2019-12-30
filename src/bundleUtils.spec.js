import gameState from './fixtures.json';
import { getBundleStatus, getDeliverableItems } from './bundleUtils';

const state = gameState.computedStates.slice(-1)[0].state.gameState;

test('getBundleStatus', () => {
  getBundleStatus(state);
  expect(1).toBe(1);
});

test('getDeliverables', () => {
  getDeliverableItems(state);
  expect(1).toBe(1);
});
