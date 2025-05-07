import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
  ) {}

  async create(dto: CreateLessonDto): Promise<Lesson> {
    return await this.lessonModel.create(dto);
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonModel
      .find()
      .populate('module_id')
      .sort({ createdAt: 'desc' })
      .lean();
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel
      .findById(id)
      .populate('module_id')
      .lean();
    if (!lesson) throw new NotFoundException('Dars topilmadi');
    return lesson;
  }

  async getModuleLessons(module_id: string): Promise<Lesson[]> {
    const lessons = await this.lessonModel
      .find({ module_id })
      .sort({ createdAt: 'desc' })
      .lean();

    if (!lessons.length) {
      throw new NotFoundException("Ma'lumot topilmadi");
    }
    return lessons;
  }

  async update(id: string, dto: UpdateLessonDto): Promise<Lesson> {
    const updated = await this.lessonModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('Dars topilmadi');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.lessonModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Dars topilmadi');
    return { message: 'Dars o‘chirildi' };
  }
}
