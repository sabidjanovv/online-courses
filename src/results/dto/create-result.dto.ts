import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  IsString,
} from 'class-validator';

export class CreateResultDto {
  @ApiProperty({
    example: '65f99a2c4c6c7eaa264cb888',
    description: 'Topshirish IDsi',
  })
  @IsMongoId()
  submission_id: string;

  @ApiProperty({
    example: '65f99a2c4c6c7eaa264cb888',
    description: 'Tekshirgan Ustoz IDsi',
  })
  @IsMongoId()
  teacher_id: string;

  @ApiProperty({ example: 87, description: 'Umumiy baho (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({
    description: 'Ustoz tomonidan tekshiruv',
    example: 'Topshiriq javobi uchun feedback bering',
  })
  @IsString()
  @IsNotEmpty()
  feedback: string;
}
