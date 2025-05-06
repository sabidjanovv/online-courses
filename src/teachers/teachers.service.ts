import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import * as argon2 from 'argon2';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const hashedPassword = await argon2.hash(createTeacherDto.password);
    const teacher = new this.teacherModel({
      ...createTeacherDto,
      password: hashedPassword,
    });
    return teacher.save();
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findById(id).lean();
    if (!teacher) {
      throw new NotFoundException(`ID: ${id} bo'yicha o‘qituvchi topilmadi`);
    }
    return teacher;
  }

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    if (updateTeacherDto.password) {
      updateTeacherDto.password = await argon2.hash(updateTeacherDto.password);
    }

    const updatedTeacher = await this.teacherModel.findByIdAndUpdate(
      id,
      updateTeacherDto,
      { new: true, runValidators: true },
    );

    if (!updatedTeacher) {
      throw new NotFoundException(`ID: ${id} bo'yicha o‘qituvchi topilmadi`);
    }

    return updatedTeacher;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedTeacher = await this.teacherModel.findByIdAndDelete(id);
    if (!deletedTeacher) {
      throw new NotFoundException(`ID: ${id} bo'yicha o‘qituvchi topilmadi`);
    }

    return { message: 'O‘qituvchi muvaffaqiyatli o‘chirildi' };
  }
}
