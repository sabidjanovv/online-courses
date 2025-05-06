import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Lesson } from '../lessons/schemas/lesson.schema';
import { Modules } from '../modules/schemas/module.schema';
import { PaginationDto } from '../common/pagination/pagination.dto';

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

  async findAll(paginationDto: PaginationDto): Promise<Course[]> {
    const { page, limit, search, category_id } = paginationDto;
    const filter: any = {};

    // Kategoriyaga bo‘yicha filtrlash
    if (category_id) {
      filter.category_id = category_id;
    }

    // Kurs nomiga bo‘yicha qidirish
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case-insensitive qidiruv
    }

    // Sahifalash (skip va limit)
    const skip = (page - 1) * limit;
    const courses = await this.courseModel
      .find(filter)
      .populate('category_id', 'name')
      .populate('teacher_id', 'name')
      .skip(skip) // Skip to the appropriate page
      .limit(limit) // Limit the number of results
      .sort({ createdAt: -1 }) // So‘rovni yaratish sanasiga qarab kamaytirish
      .lean();

    if (!courses.length) {
      throw new NotFoundException('Kurslar topilmadi');
    }

    return courses;
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
