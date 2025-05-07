import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TeachersService } from '../../teachers/teachers.service';
import { CoursesService } from '../../courses/courses.service';
import { ModulesService } from '../../modules/modules.service';
import { AssignmentService } from '../../assignments/assignments.service';

@Injectable()
export class AssignmentGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly teachersService: TeachersService,
    private readonly coursesService: CoursesService,
    private readonly modulesService: ModulesService,
    private readonly assignmentService: AssignmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token yo‘q');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token noto‘g‘ri formatda');
    }

    let payload: any;
    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } catch (err) {
      throw new BadRequestException('Token noto‘g‘ri yoki muddati o‘tgan');
    }

    const userId = payload.id;
    const role = payload.role;

    // superadmin va admin uchun ruxsat
    if (role === 'superadmin' || role === 'admin') {
      return true;
    }

    const teacher = await this.teachersService.findOne(userId);
    if (!teacher) {
      throw new ForbiddenException('Siz teacher emassiz');
    }

    // module_id ni aniqlash
    let moduleId: string;

    if (req.method === 'POST') {
      moduleId = req.body.module_id;
      if (!moduleId) {
        throw new ForbiddenException('module_id talab qilinadi');
      }
    } else if (req.method === 'PATCH') {
      const assignmentId = req.params.id;
      if (!assignmentId) {
        throw new ForbiddenException('assignment ID talab qilinadi');
      }

      const assignment = await this.assignmentService.findOne(assignmentId);
      if (!assignment) {
        throw new ForbiddenException('assignment topilmadi');
      }

      moduleId =
        assignment.module_id?._id?.toString() || assignment.module_id?.toString();
      if (!moduleId) {
        throw new ForbiddenException('assignment ichida module_id yo‘q');
      }
    } else {
      throw new ForbiddenException(
        'Faqat POST yoki PATCH so‘rovlar uchun ruxsat',
      );
    }

    // modulni tekshirish
    const module = await this.modulesService.findOne(moduleId);
    if (!module) {
      throw new ForbiddenException('Modul topilmadi');
    }

    const courseId =
      module.course_id?._id?.toString() || module.course_id?.toString();
    const course = await this.coursesService.findOne(courseId);
    if (!course) {
      throw new ForbiddenException('Kurs topilmadi');
    }

    if (
      course.teacher_id?._id?.toString() !== userId &&
      course.teacher_id?.toString() !== userId
    ) {
      throw new ForbiddenException('Bu modul sizga tegishli emas');
    }

    return true;
  }
}
