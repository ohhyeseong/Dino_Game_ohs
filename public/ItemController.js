import { gameAssetsData } from './Socket.js';
import Item from './Item.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed, score) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.score = score;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    // 현재 스테이지까지의 아이템만 필터링 진행
    const availableItemIds = gameAssetsData.itemUnlocks.data
      .filter((unlock) => unlock.stage_id <= this.score.currentStage) // 현재 스테이지보다 낮은 stage_id 필터링
      .map((unlock) => unlock.item_id); // item_id만 추출

    const availableItems = this.itemImages.filter((item) => availableItemIds.includes(item.id));

    if (!availableItems.length) return;

    const randomItem = availableItems[this.getRandomNumber(0, availableItems.length - 1)];
    // const index = this.getRandomNumber(0, this.itemImages.length - 1);
    // const itemInfo = this.itemImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - randomItem.height);

    const item = new Item(
      this.ctx,
      randomItem.id,
      x,
      y,
      randomItem.width,
      randomItem.height,
      randomItem.image,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return { itemId: collidedItem.id }; // 충돌한 아이템 ID 반환
    }
    return null;
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
