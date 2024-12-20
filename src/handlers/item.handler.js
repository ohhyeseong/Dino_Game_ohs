import { getGameAssets } from '../init/assets.js';

export const ItemHendler = (userId, payload) => {
  const { items } = getGameAssets();
  const item = items.data.find((item) => item.id === payload.itemId);
  if (!item) {
    return { status: 'fail', message: 'no' };
  }

  return { status: 'success', message: `Item `, itemId: item.id };
};
