import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { SubmissionController } from './submissions.controller';
import { SubmissionService } from './submissions.service';
import { Result, ResultSchema } from '../results/schemas/result.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
      { name: Result.name, schema: ResultSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AssignmentsModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionsModule {}
