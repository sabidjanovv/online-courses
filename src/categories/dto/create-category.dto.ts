import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Programming', description: 'Kategoriya nomi' })
  @IsString()
  @IsNotEmpty({ message: 'Kategoriya nomi bo‘sh bo‘lishi mumkin emas' })
  name: string;
}
