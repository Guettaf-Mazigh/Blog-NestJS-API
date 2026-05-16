import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repo: MockRepository<Article> & {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repo = module.get(getRepositoryToken(Article));
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates and saves an article', async () => {
      const dto = { title: 'T', content: 'Content' } as any;
      const created = { id: 1, ...dto } as Article;
      (repo.create as jest.Mock).mockReturnValue(created);
      (repo.save as jest.Mock).mockResolvedValue(created);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('returns an array of articles', async () => {
      const list = [{ id: 1, title: 'a', content: 'b' }];
      (repo.find as jest.Mock).mockResolvedValue(list);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toBe(list);
    });
  });

  describe('findOne', () => {
    it('returns an article when found', async () => {
      const article = { id: 1, title: 'a' } as Article;
      (repo.findOneBy as jest.Mock).mockResolvedValue(article);

      const result = await service.findOne(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBe(article);
    });

    it('returns null when not found', async () => {
      (repo.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('updates and returns the saved article when exists', async () => {
      const dto = { title: 'updated' } as any;
      const preloaded = { id: 1, ...dto } as Article;
      (repo.preload as jest.Mock).mockResolvedValue(preloaded);
      (repo.save as jest.Mock).mockResolvedValue(preloaded);

      const result = await service.update(1, dto);

      expect(repo.preload).toHaveBeenCalledWith({ id: 1, ...dto });
      expect(repo.save).toHaveBeenCalledWith(preloaded);
      expect(result).toEqual(preloaded);
    });

    it('throws NotFoundException when article does not exist', async () => {
      (repo.preload as jest.Mock).mockResolvedValue(undefined);

      await expect(service.update(999, { title: 'x' } as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deletes and returns deleted:true when affected>0', async () => {
      (repo.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(repo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });

    it('throws NotFoundException when nothing deleted', async () => {
      (repo.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
