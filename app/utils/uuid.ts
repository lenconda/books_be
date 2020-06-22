import uuidv4 from 'uuid/v4';
import uuidv5 from 'uuid/v5';

export const uuid = (seed: string = Date.now().toString()) => {
  return Buffer.from(uuidv5(seed, uuidv4())).toString('base64').slice(-9, -1);
};
