import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { SubmissionController } from './submissions.controller';
import { SubmissionService } from './submissions.service';

@Module({
  imports:[MongooseModule.forFeature([{name:Submission.name, schema:SubmissionSchema}])],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionsModule {}
