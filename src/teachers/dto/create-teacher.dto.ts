import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({
    example: 'Aliyev Alisher',
    description: "O'qituvchining to‘liq F.I.Sh",
  })
  @IsString({ message: 'Ism matn ko‘rinishida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Ism bo‘sh bo‘lishi mumkin emas' })
  name: string;

  @ApiProperty({
    example: '10 yillik tajriba, PhD darajasi',
    description: "O'qituvchining malaka va tajribasi",
  })
  @IsString({ message: 'Bio matn ko‘rinishida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Bio bo‘sh bo‘lishi mumkin emas' })
  bio: string;

  @ApiProperty({
    example: 'alisher123',
    description: "O'qituvchining login ma'lumotlari",
  })
  @IsString({ message: 'Login matn ko‘rinishida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Login bo‘sh bo‘lishi mumkin emas' })
  login: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: "O'qituvchining paroli (kamida 6 ta belgi)",
  })
  @IsString({ message: 'Parol matn ko‘rinishida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Parol bo‘sh bo‘lishi mumkin emas' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
  password: string;
}
