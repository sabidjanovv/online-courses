import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Lesson } from '../lessons/schemas/lesson.schema';
import { Modules } from '../modules/schemas/module.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Modules.name)
    private readonly modulesModel: Model<Modules>,
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = new this.courseModel(createCourseDto);
    return await course.save();
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel
      .find()
      .populate('category_id', 'name')
      .populate('teacher_id', 'name')
      .sort({ createdAt: 'desc' })
      .lean();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel
      .findById(id)
      .populate('category_id', 'name')
      .populate('teacher_id', 'name')
      .lean();

    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }
    return course;
  }

  async getCourseModules(course_id: string): Promise<Modules[]> {
    const modules = await this.modulesModel.find({ course_id });
    if (!modules.length) {
      throw new NotFoundException('Modullar topilmadi!');
    }

    return modules;
  }

  async getCourseLessons(course_id: string): Promise<Lesson[]> {
    const lessons = await this.lessonModel
      .find()
      .populate({
        path: 'module_id',
        match: { course_id },
      })
      .lean();

    const filteredLessons = lessons.filter(
      (lesson) => lesson.module_id !== null,
    );

    if (!filteredLessons.length) {
      throw new NotFoundException('Darslar topilmadi!');
    }

    return filteredLessons;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const updated = await this.courseModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new NotFoundException('Kurs topilmadi');
    }
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.courseModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Kurs topilmadi');
    }
    return { message: 'Kurs muvaffaqiyatli o‘chirildi' };
  }
}
