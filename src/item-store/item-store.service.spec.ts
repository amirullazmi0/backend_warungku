import { Test, TestingModule } from '@nestjs/testing';
import { ItemStoreService } from './item-store.service';

describe('ItemStoreService', () => {
  let service: ItemStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemStoreService],
    }).compile();

    service = module.get<ItemStoreService>(ItemStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
