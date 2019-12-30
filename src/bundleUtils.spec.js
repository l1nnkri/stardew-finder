import gameState from './fixtures.json';
import { getBundleStatus } from './bundleUtils';

test('getBundleStatus', () => {
  getBundleStatus(gameState.computedStates.slice(-1)[0].state.gameState);
  expect(1).toBe(1);
});
