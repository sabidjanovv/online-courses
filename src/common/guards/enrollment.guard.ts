import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnrollmentsService } from '../../enrollments/enrollments.service';
import { CoursesService } from '../../courses/courses.service';

@Injectable()
export class EnrollmentGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly enrollmentsService: EnrollmentsService, // Yozilishlarni tekshirish uchun servis
    private readonly coursesService: CoursesService, // Kursni olish uchun servis
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException(
        'Foydalanuvchi avtorizatsiyadan o‘tmagan',
      );
    }

    const bearer = authHeaders.split(' ')[0];
    const token = authHeaders.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Foydalanuvchi avtorizatsiyadan o‘tmagan',
      );
    }

    let payload: any;
    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    if (!payload) {
      throw new UnauthorizedException(
        'Foydalanuvchi avtorizatsiyadan o‘tmagan',
      );
    }

    if (payload.isActive !== true) {
      throw new ForbiddenException('Foydalanuvchi faol emas!');
    }

    const { courseId } = req.params; 
    if (!courseId) {
      throw new BadRequestException('Kurs ID si kerak');
    }

    const isEnrolled = await this.enrollmentsService.isEnrolled(
      payload.id,
      courseId,
    );
    // console.log(isEnrolled, payload.id, courseId);
    
    if (!isEnrolled) {
      throw new ForbiddenException('Foydalanuvchi bu kursga yozilmagan');
    }

    return true;
  }
}
