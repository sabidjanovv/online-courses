import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ description: 'Topshiriq ID' })
  assignment_id: string;

  @ApiProperty({ description: 'Foydalanuvchi ID' })
  user_id: string;

  @ApiProperty({ example: 'Bu mening javobim', description: 'Javob matni' })
  @IsString()
  answer: string;

  @ApiProperty({
    example: 95,
    required: false,
    description: 'Bahosi (0 dan 100 gacha)',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;
}
