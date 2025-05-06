import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoursesService } from '../../courses/courses.service';
import { TeachersService } from '../../teachers/teachers.service';
import { ModulesService } from '../../modules/modules.service';

@Injectable()
export class TeacherAndAdminModuleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly coursesService: CoursesService,
    private readonly teachersService: TeachersService,
    private readonly modulesService: ModulesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const [bearer, token] = authHeaders.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized user');
    }

    let payload: any;
    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const userId = payload.id;
    const role = payload.role;

    if (role === 'admin' || role === 'superadmin') {
      return true;
    }

    const teacher = await this.teachersService.findOne(userId);
    if (teacher) {
      let courseId = req.body.course_id;

      if (!courseId && req.params.id) {
        const module = await this.modulesService.findOne(req.params.id);
        if (!module) throw new ForbiddenException('Modul topilmadi');
        courseId = module.course_id;
      }

      if (!courseId) throw new ForbiddenException('course_id kerak');

      const course = await this.coursesService.findOne(courseId);
      if (!course) throw new ForbiddenException('Kurs topilmadi');

      if (course.teacher_id._id.toString() !== userId) {
        throw new ForbiddenException('Bu kurs sizga tegishli emas');
      }

      return true;
    }

    throw new ForbiddenException('Sizda ruxsat yo‘q');
  }
}
