import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserRole } from '../common/enums/enum';

@ApiTags('Auth') // Swagger UI bo'lim nomi
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('superadmin/signup')
  @ApiOperation({ summary: 'Foydalanuvchini ro‘yxatdan o‘tkazish' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
  })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  signUpSuperAdmin(@Body() createAuthDto: CreateUserDto) {
    const role = UserRole.SUPERADMIN;
    return this.authService.signUp(createAuthDto, role);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Foydalanuvchini ro‘yxatdan o‘tkazish' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
  })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri so‘rov' })
  signUp(@Body() createAuthDto: CreateUserDto) {
    const role = UserRole.STUDENT;
    return this.authService.signUp(createAuthDto, role);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Foydalanuvchini tizimga kirishi' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi tizimga muvaffaqiyatli kirdi',
  })
  @ApiResponse({ status: 401, description: 'Login yoki parol noto‘g‘ri' })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('teacher/signin')
  @ApiOperation({ summary: 'Foydalanuvchini tizimga kirishi' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi tizimga muvaffaqiyatli kirdi',
  })
  @ApiResponse({ status: 401, description: 'Login yoki parol noto‘g‘ri' })
  @HttpCode(HttpStatus.OK)
  async signInTeacher(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signout/:id')
  @ApiOperation({ summary: 'Foydalanuvchini tizimdan chiqishi' })
  @ApiParam({
    name: 'id',
    description: 'Foydalanuvchi ID sini kiriting',
    example: '64b25c2311dd2b001f2d994f',
  })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi tizimdan muvaffaqiyatli chiqdi',
  })
  @ApiResponse({
    status: 400,
    description: 'Noto‘g‘ri so‘rov yoki ID noto‘g‘ri',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@Param('id') userId: string) {
    return this.authService.signOut(userId);
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Foydalanuvchi profilini olish' })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchining token orqali profili',
  })
  @ApiResponse({ status: 401, description: 'Token noto‘g‘ri yoki mavjud emas' })
  @ApiBearerAuth()
  async profileCheck(@Headers('authorization') authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new UnauthorizedException('Avtorizatsiya tokeni taqdim etilmagan');
    }
    const access_token = authorization.split(' ')[1];
    return await this.authService.profileCheck(access_token);
  }
}
