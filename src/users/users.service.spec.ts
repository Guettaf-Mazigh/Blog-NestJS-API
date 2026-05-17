import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>> & {
  find?: jest.Mock;
  findOneBy?: jest.Mock;
  preload?: jest.Mock;
  save?: jest.Mock;
  delete?: jest.Mock;
};

const createMockRepository = (): MockRepository => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: MockRepository;

  beforeEach(async () => {
    usersRepository = createMockRepository();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll', () => {
    it('returns an array of users', async () => {
      const expected = [{ id: 1, username: 'u1' }];
      usersRepository.find.mockResolvedValue(expected);
      await expect(usersService.findAll()).resolves.toEqual(expected);
      expect(usersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns a user when found', async () => {
      const user = { id: 1, username: 'u1' };
      usersRepository.findOneBy.mockResolvedValue(user);
      await expect(usersService.findOne(1)).resolves.toEqual(user);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('throws NotFoundException when not found', async () => {
      usersRepository.findOneBy.mockResolvedValue(undefined);
      await expect(usersService.findOne(2)).rejects.toThrow('User 2 not found');
    });
  });

  describe('update', () => {
    it('updates and returns the user when exists', async () => {
      const dto = { username: 'new' };
      const preloaded = { id: 1, ...dto };
      usersRepository.preload.mockResolvedValue(preloaded);
      usersRepository.save.mockResolvedValue(preloaded);

      await expect(usersService.update(1, dto as any)).resolves.toEqual(
        preloaded,
      );
      expect(usersRepository.preload).toHaveBeenCalledWith({ id: 1, ...dto });
      expect(usersRepository.save).toHaveBeenCalledWith(preloaded);
    });

    it('throws NotFoundException when preload returns undefined', async () => {
      usersRepository.preload.mockResolvedValue(undefined);
      await expect(
        usersService.update(99, { username: 'x' } as any),
      ).rejects.toThrow('User 99 not found');
    });
  });

  describe('remove', () => {
    it('deletes and returns deleted:true when affected>0', async () => {
      usersRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(usersService.remove(1)).resolves.toEqual({ deleted: true });
      expect(usersRepository.delete).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when affected === 0', async () => {
      usersRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(usersService.remove(2)).rejects.toThrow('User 2 not found');
    });
  });
});
