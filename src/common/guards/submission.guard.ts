import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AssignmentService } from '../../assignments/assignments.service';
import { SubmissionService } from '../../submissions/submissions.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubmissionGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly assignmentsService: AssignmentService,
    private readonly submissionsService: SubmissionService,
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

    const userIdFromToken = payload.id;
    let userIdToCheck: any;
    let assignmentIdToCheck: string;

    if ((req.method === 'PATCH' || req.method === 'GET') && req.params.id) {
      const submissionResult = await this.submissionsService.findOne(
        req.params.id,
      );
      const submission = submissionResult.submission;

      if (!submission) {
        throw new BadRequestException('Submission topilmadi');
      }

      const userId = submission.user_id as string | { _id: any };
      const assignmentId = submission.assignment_id as string | { _id: any };

      userIdToCheck =
        typeof userId === 'string' ? userId : userId?._id?.toString();

      assignmentIdToCheck =
        typeof assignmentId === 'string'
          ? assignmentId
          : assignmentId?._id?.toString();
    } else {
      userIdToCheck = req.body.user_id;
      assignmentIdToCheck = req.body.assignment_id;
    }

    console.log(userIdToCheck, userIdToCheck);
    

    if (!userIdToCheck || userIdToCheck.toString() !== userIdToCheck) {
      throw new ForbiddenException(
        "Faqat o'zingizning topshiriqlaringizni yuklashingiz mumkin",
      );
    }

    const user = await this.userModel.findById(userIdFromToken);
    if (!user || !user.isActive) {
      throw new ForbiddenException('Sizning profilingiz aktiv emas');
    }

    const assignment =
      await this.assignmentsService.findOne(assignmentIdToCheck);
    if (!assignment) {
      throw new ForbiddenException('Assignment topilmadi');
    }

    return true;
  }
}
