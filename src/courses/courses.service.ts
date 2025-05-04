import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = new this.courseModel(createCourseDto);
    return await course.save();
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel
      .find()
      .populate('category_id', 'name') 
      .populate('teacher_id', 'name') 
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
