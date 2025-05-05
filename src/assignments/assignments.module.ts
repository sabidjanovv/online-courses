import { Module } from '@nestjs/common';
import { AssignmentService } from './assignments.service';
import { AssignmentController } from './assignments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Assignment, AssignmentSchema } from './schemas/assignment.schema';
// import { ModuleSchema, Modules } from '../modules/schemas/module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
      // { name: Modules.name, schema: ModuleSchema },
    ]),
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentsModule {}
