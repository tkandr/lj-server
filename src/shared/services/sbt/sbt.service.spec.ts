import { Test, TestingModule } from '@nestjs/testing';
import { SbtService } from './sbt.service';

describe('SbtService', () => {
  let service: SbtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SbtService],
    }).compile();

    service = module.get<SbtService>(SbtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
