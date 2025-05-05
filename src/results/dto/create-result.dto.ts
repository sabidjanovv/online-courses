import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateResultDto {
  @ApiProperty({
    example: '65f99a2c4c6c7eaa264cb129',
    description: 'Foydalanuvchi ID',
  })
  @IsMongoId()
  user_id: string;

  @ApiProperty({ example: '65f99a2c4c6c7eaa264cb888', description: 'Kurs ID' })
  @IsMongoId()
  course_id: string;

  @ApiProperty({ example: 87, description: 'Umumiy baho (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({ example: true, description: 'Tugatildimi yoki yo‘q' })
  @IsBoolean()
  completed: boolean;
}
