import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'ali@gmail.com',
    description: 'Foydalanuvchi emaili',
  })
  @IsOptional({})
  email: string;

  @ApiProperty({
    example: 'alisher123',
    description: 'Ustoz logini',
  })
  @IsOptional({})
  login: string;

  @ApiProperty({
    example: '12345678',
    description: 'Foydalanuvchi paroli (kamida 6 ta belgi)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
