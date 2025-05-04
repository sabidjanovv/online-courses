import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ example: 'Frontend Asoslari' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'React va HTML/CSS asoslari' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '665ff9ec33a1a7dd0ea8c9e2' })
  @IsMongoId()
  course_id: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
