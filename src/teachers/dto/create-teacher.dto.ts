import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Aliyev Alisher', description: "O'qituvchi F.I.Sh" })
  @IsString()
  @IsNotEmpty({ message: 'Ism bo‘sh bo‘lmasligi kerak' })
  name: string;

  @ApiProperty({
    example: '10 yillik tajriba, PhD darajasi',
    description: "O'qituvchi malakasi",
  })
  @IsString()
  @IsNotEmpty({ message: 'Bio bo‘sh bo‘lmasligi kerak' })
  bio: string;
}
