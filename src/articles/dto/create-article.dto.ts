import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content!: string;
}
