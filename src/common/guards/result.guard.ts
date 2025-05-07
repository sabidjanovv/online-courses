import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SubmissionService } from '../../submissions/submissions.service';
import { AssignmentService } from '../../assignments/assignments.service';
import { ModulesService } from '../../modules/modules.service';
import { CoursesService } from '../../courses/courses.service';
import { InjectModel } from '@nestjs/mongoose';
import { Result, ResultDocument } from '../../results/schemas/result.schema';
import { Model } from 'mongoose';

@Injectable()
export class ResultGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly submissionService: SubmissionService,
    private readonly assignmentService: AssignmentService,
    private readonly moduleService: ModulesService,
    private readonly courseService: CoursesService,
    @InjectModel(Result.name)
    private readonly resultModel: Model<ResultDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException('Token topilmadi');
    }

    const bearer = authHeaders.split(' ')[0];
    const token = authHeaders.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token noto‘g‘ri');
    }

    let payload: any;
    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    const teacherIdFromToken = payload.id;
    let teacherIdToCheck: string;
    let submissionId: string;

    if (req.method.toUpperCase() === 'PATCH' && req.params.id) {
      const result = await this.resultModel.findById(req.params.id);
      if (!result) {
        throw new BadRequestException('Natija topilmadi');
      }
      teacherIdToCheck = result.teacher_id?.toString();
      submissionId = result.submission_id?.toString();
    } else {
      teacherIdToCheck = req.body.teacher_id;
      submissionId = req.body.submission_id;
    }

    if (!teacherIdToCheck || teacherIdToCheck !== teacherIdFromToken) {
      throw new ForbiddenException(
        'Faqat o‘zingizga tegishli natijalarni kiritishingiz mumkin',
      );
    }

    const submission = await this.submissionService.findOne(submissionId);
    if (!submission) {
      throw new BadRequestException('Submission topilmadi');
    }

    const assignmentId =
      typeof submission.submission.assignment_id === 'string'
        ? submission.submission.assignment_id
        : (submission.submission.assignment_id as { _id: string })._id;

    const assignment = await this.assignmentService.findOne(
      assignmentId.toString(),
    );

    if (!assignment) {
      throw new BadRequestException('Assignment topilmadi');
    }

    const module = await this.moduleService.findOne(
      assignment.module_id._id.toString(),
    );
    if (!module) {
      throw new BadRequestException('Modul topilmadi');
    }

    const course = await this.courseService.findOne(
      module.course_id._id.toString(),
    );
    if (!course) {
      throw new BadRequestException('Kurs topilmadi');
    }

    if (course.teacher_id._id.toString() !== teacherIdFromToken) {
      throw new ForbiddenException('Bu kurs sizga tegishli emas');
    }

    return true;
  }
}
