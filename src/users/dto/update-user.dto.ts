import { IsEmail, IsNotEmpty,IsString,MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  name!: string;
  
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @IsString()
  password!: string;
}