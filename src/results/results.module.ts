import { Module } from '@nestjs/common';
import { ResultService } from './results.service';
import { ResultController } from './results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './schemas/result.schema';
import { SubmissionsModule } from '../submissions/submissions.module';
import { AssignmentsModule } from '../assignments/assignments.module';
import { ModulesModule } from '../modules/modules.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
    SubmissionsModule,
    AssignmentsModule,
    ModulesModule,
    CoursesModule,
  ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultsModule {}
