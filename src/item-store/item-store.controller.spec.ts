import { Test, TestingModule } from '@nestjs/testing';
import { ItemStoreController } from './item-store.controller';

describe('ItemStoreController', () => {
  let controller: ItemStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemStoreController],
    }).compile();

    controller = module.get<ItemStoreController>(ItemStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
