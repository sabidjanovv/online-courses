import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const teacher = new this.teacherModel(createTeacherDto);
    return await teacher.save();
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().sort({ createdAt: 'desc' }).lean();
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id).lean();
    if (!teacher) {
      throw new NotFoundException('O‘qituvchi topilmadi');
    }
    return teacher;
  }

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const updated = await this.teacherModel.findByIdAndUpdate(
      id,
      updateTeacherDto,
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw new NotFoundException('O‘qituvchi topilmadi');
    }

    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.teacherModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('O‘qituvchi topilmadi');
    }

    return { message: 'O‘qituvchi muvaffaqiyatli o‘chirildi' };
  }
}
