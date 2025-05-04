import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali Valiyev', description: 'Foydalanuvchi ismi' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'ali@gmail.com',
    description: 'Foydalanuvchi emaili',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Foydalanuvchi paroli (kamida 6 ta belgi)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'student',
    enum: UserRole,
    description: 'Foydalanuvchi roli',
  })
  @IsEnum(UserRole)
  role: UserRole;
}
