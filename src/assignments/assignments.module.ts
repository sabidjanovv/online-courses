import { Module } from '@nestjs/common';
import { AssignmentService } from './assignments.service';
import { AssignmentController } from './assignments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Assignment, AssignmentSchema } from './schemas/assignment.schema';
import { CoursesModule } from '../courses/courses.module';
import { TeachersModule } from '../teachers/teachers.module';
import { ModulesModule } from '../modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
    ]),
    CoursesModule,
    TeachersModule,
    ModulesModule,
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentsModule {}
