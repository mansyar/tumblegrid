import type { LevelDefinition } from '@/store/types';

import campaign01 from './campaign/01-the-descent.json';
import campaign02 from './campaign/02-the-bank-shot.json';
import campaign03 from './campaign/03-velocity-check.json';
import campaign04 from './campaign/04-the-switchback.json';
import campaign05 from './campaign/05-efficiency-crisis.json';
import sandboxData from './sandbox.json';

// JSON imports need explicit casting due to tuple type inference
export const campaignLevels: LevelDefinition[] = [
  campaign01 as unknown as LevelDefinition,
  campaign02 as unknown as LevelDefinition,
  campaign03 as unknown as LevelDefinition,
  campaign04 as unknown as LevelDefinition,
  campaign05 as unknown as LevelDefinition,
];

export const sandboxLevel: LevelDefinition =
  sandboxData as unknown as LevelDefinition;

export function getLevelById(id: string): LevelDefinition | undefined {
  if (id === 'sandbox') {
    return sandboxLevel;
  }
  return campaignLevels.find((level) => level.id === id);
}

export function getLevelByIndex(index: number): LevelDefinition | undefined {
  return campaignLevels[index];
}
