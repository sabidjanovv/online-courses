import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ example: '1-dars: Kirish' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Bu darsda siz kursning asosiy maqsadlari bilan tanishasiz.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
  
  @ApiProperty({ example: '665ffd4c7b0a9f20f6e124a1' })
  @IsNotEmpty()
  @IsMongoId()
  module_id: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
