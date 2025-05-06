import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { hash, verify } from 'argon2';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as uuid from 'uuid';
import { createApiResponse } from '../common/utils/api-response';
import { JwtPayload } from 'jsonwebtoken';
import { SignInDto } from './dto/sign-in.dto';
import { UserRole } from '../common/enums/enum';
import { Teacher, TeacherDocument } from '../teachers/schemas/teacher.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Teacher.name) private readonly teacherModel: Model<TeacherDocument>,
  ) {}
  async signUp(createUserDto: CreateUserDto, role: UserRole) {
    const existinguser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existinguser) {
      throw new BadRequestException(
        'Bu email orqali allaqachon ro‘yxatdan o‘tilgan',
      );
    }

    const user = new this.userModel({
      ...createUserDto,
      role,
    });

    const hashedPassword = await hash(createUserDto.password);

    const { access_token, refresh_token } = await this.generateTokens(user);
    const hashedRefreshtoken = await hash(refresh_token);
    const activation_link = uuid.v4();

    user.password = hashedPassword;
    user.activation_link = activation_link;

    await user.save();

    const user_data = {
      id: user._id,
      name: user.name,
      email: user.email,
      role,
    };

    try {
      await this.mailService.sendMail(user);
    } catch (error) {
      console.log('Mail ERROR:', error);
      throw new BadRequestException(
        `Aktivatsiya xatini yuborishda xatolik yuz berdi: ${error}`,
      );
    }

    return createApiResponse(
      201,
      `${user.email} emailga yuborilgan link orqali tasdiqlang`,
      {
        payload: user_data,
      },
    );
  }

  async generateTokens(user: User) {
    const payload: JwtPayload = {
      id: user._id,
      name: user.name,
      isActive: user.isActive,
      email: user.email,
      role: user.role,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async signIn(signInDto: SignInDto) {
    let user;
    let isTeacher = false;

    if (signInDto.email) {
      user = await this.userModel.findOne({ email: signInDto.email });
    }
    else if (signInDto.login) {
      user = await this.teacherModel.findOne({ login: signInDto.login });
      isTeacher = true; 
    }

    if (!user) {
      throw new BadRequestException("Foydalanuvchi nomi yoki parol noto'g'ri");
    }

    if (!isTeacher && !user.isActive) {
      throw new ForbiddenException('Foydalanuvchi faol emas');
    }

    const validPassword = await verify(user.password, signInDto.password);
    if (!validPassword) {
      throw new BadRequestException("Foydalanuvchi nomi yoki parol noto'g'ri");
    }

    const { access_token, refresh_token } = await this.generateTokens(user);

    user.hashed_refresh_token = await hash(refresh_token);
    await user.save();

    return createApiResponse(200, 'Tizimga muvaffaqiyatli kirildi', {
      access_token,
      id: user._id,
      email: user.email || user.login, 
      role: user.role || 'teacher', 
    });
  }

  async signOut(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.hashed_refresh_token) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    user.hashed_refresh_token = '';
    await user.save();
    return createApiResponse(200, 'Tizimdan muvaffaqiyatli chiqildi');
  }

  async profileCheck(access_token: string) {
    try {
      const verified_token = await this.jwtService.verify(access_token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });

      if (!verified_token) {
        throw new UnauthorizedException("Berilgan token noto'g'ri");
      }

      const user = await this.userModel.findById(verified_token.id);

      if (!user) {
        throw new UnauthorizedException(
          'Berilgan token bilan foydalanuvchi topilmadi',
        );
      }

      return {
        success: true,
        message: 'Foydalanuvchi profili muvaffaqiyatli tekshirildi',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isActive: user.isActive,
          role: user.role,
        },
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token muddati tugagan');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException("Token imzosi noto'g'ri");
      } else {
        throw new UnauthorizedException(
          'Autentifikatsiya muvaffaqiyatsiz tugadi',
        );
      }
    }
  }
}
