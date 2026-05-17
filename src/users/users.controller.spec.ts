import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Partial<Record<keyof UsersService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockResolvedValue([{ id: 1 }]),
      findOne: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ id: 1 }),
      remove: jest.fn().mockResolvedValue({ deleted: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll calls service', async () => {
    await expect(controller.findAll()).resolves.toEqual([{ id: 1 }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne calls service with id', async () => {
    await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('update calls service with id and dto', async () => {
    const dto = { name: 'n', email: 'a@b.com', password: '123456' };
    await expect(controller.update(1, dto as any)).resolves.toEqual({ id: 1 });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove calls service', async () => {
    await expect(controller.remove(1)).resolves.toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  describe('error cases', () => {
    it('findOne rethrows NotFoundException from service', async () => {
      const err = new (require('@nestjs/common').NotFoundException)(
        'User 2 not found',
      );
      (service.findOne as jest.Mock).mockRejectedValueOnce(err);
      await expect(controller.findOne(2)).rejects.toThrow('User 2 not found');
    });

    it('update rethrows NotFoundException from service', async () => {
      const err = new (require('@nestjs/common').NotFoundException)(
        'User 3 not found',
      );
      (service.update as jest.Mock).mockRejectedValueOnce(err);
      await expect(controller.update(3, { name: 'x' } as any)).rejects.toThrow(
        'User 3 not found',
      );
    });

    it('remove rethrows NotFoundException from service', async () => {
      const err = new (require('@nestjs/common').NotFoundException)(
        'User 4 not found',
      );
      (service.remove as jest.Mock).mockRejectedValueOnce(err);
      await expect(controller.remove(4)).rejects.toThrow('User 4 not found');
    });
  });
});
