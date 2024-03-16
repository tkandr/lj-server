import { Test, TestingModule } from '@nestjs/testing';

import { PostChainService } from './post-chain.service';

describe('PostChainService', () => {
  let service: PostChainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostChainService],
    }).compile();

    service = module.get<PostChainService>(PostChainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
