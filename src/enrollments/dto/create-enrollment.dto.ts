import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ description: 'Foydalanuvchi ID (User ObjectId)' })
  @IsNotEmpty()
  @IsMongoId()
  user_id: string;

  @ApiProperty({ description: 'Kurs ID (Course ObjectId)' })
  @IsNotEmpty()
  @IsMongoId()
  course_id: string;
}
