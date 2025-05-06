import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { Lesson, LessonSchema } from '../lessons/schemas/lesson.schema';
import { ModuleSchema, Modules } from '../modules/schemas/module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: Modules.name, schema: ModuleSchema },
    ]),
    EnrollmentsModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports:[CoursesService]
})
export class CoursesModule {}
