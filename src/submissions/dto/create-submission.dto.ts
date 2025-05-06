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
}
