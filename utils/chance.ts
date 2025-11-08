import { Chance } from 'chance';

let globalChance: Chance.Chance = new Chance.Chance();

export const setupGlobalChance = () => {
  globalChance = new Chance.Chance();
};

export { globalChance as chance };