import { Test, TestingModule } from '@nestjs/testing';
import { ParametreNotationService } from './parametre-notation.service';

describe('ParametreNotationService', () => {
  let service: ParametreNotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParametreNotationService],
    }).compile();

    service = module.get<ParametreNotationService>(ParametreNotationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
