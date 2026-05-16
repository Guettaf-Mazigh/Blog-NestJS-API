import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { NotFoundException } from '@nestjs/common';

const mockArticle = { id: 1, title: 't', content: 'c' };

const createMockService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ReturnType<typeof createMockService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: createMockService(),
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get(ArticlesService) as any;
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('delegates to service.create and returns result', async () => {
      service.create.mockResolvedValue(mockArticle);
      const dto = { title: 't', content: 'c' };

      const res = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(res).toEqual(mockArticle);
    });

    it('propagates errors from service', async () => {
      service.create.mockRejectedValue(new Error('fail'));
      await expect(controller.create({} as any)).rejects.toThrow('fail');
    });
  });

  describe('findAll', () => {
    it('returns array from service', async () => {
      service.findAll.mockResolvedValue([mockArticle]);
      const res = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(res).toEqual([mockArticle]);
    });
  });

  describe('findOne', () => {
    it('returns item when found', async () => {
      service.findOne.mockResolvedValue(mockArticle);
      const res = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(res).toEqual(mockArticle);
    });

    it('propagates NotFoundException', async () => {
      service.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('delegates update and returns result', async () => {
      const updated = { id: 1, title: 'u' };
      service.update.mockResolvedValue(updated);
      const res = await controller.update('1', { title: 'u' } as any);
      expect(service.update).toHaveBeenCalledWith(1, { title: 'u' });
      expect(res).toEqual(updated);
    });

    it('propagates NotFoundException from service', async () => {
      service.update.mockRejectedValue(new NotFoundException());
      await expect(controller.update('999', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('delegates remove and returns result', async () => {
      service.remove.mockResolvedValue({ deleted: true });
      const res = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(res).toEqual({ deleted: true });
    });

    it('propagates NotFoundException from service', async () => {
      service.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
