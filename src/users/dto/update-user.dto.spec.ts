import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto validation', () => {
  it('valid dto passes validation', async () => {
    const dto = plainToInstance(UpdateUserDto, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret12',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('invalid dto fails validation', async () => {
    const dto = plainToInstance(UpdateUserDto, {
      name: 'Jo',
      email: 'bad-email',
      password: '123',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const props = errors.map((e) => e.property);
    expect(props).toEqual(
      expect.arrayContaining(['name', 'email', 'password']),
    );
  });
});
