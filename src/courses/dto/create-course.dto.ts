import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
} from 'class-validator';
import { CourseLevel } from '../../common/enums/enum';

export class CreateCourseDto {
  @ApiProperty({ example: 'JavaScript Asoslari' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Bu kurs JavaScript asoslarini o‘rgatadi' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 199000 })
  @IsNumber()
  price: number;

  @ApiProperty({
    enum: CourseLevel,
    example: CourseLevel.BOSHLANGICH,
  })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({
    example: '66427ed765218aac3f1b21b4',
    description: 'Category ID (Mongo ObjectId)',
  })
  @IsMongoId()
  category_id: string;

  @ApiProperty({
    example: '66427ef465218aac3f1b21d2',
    description: 'Teacher ID (Mongo ObjectId)',
  })
  @IsMongoId()
  teacher_id: string;
}
