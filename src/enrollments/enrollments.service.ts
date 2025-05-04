import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enrollment } from './schemas/enrollment.schema';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name) private readonly model: Model<Enrollment>,
  ) {}

  async create(dto: CreateEnrollmentDto): Promise<Enrollment> {
    const enrollment = new this.model(dto);
    return enrollment.save();
  }

  async findAll(): Promise<Enrollment[]> {
    return this.model
      .find()
      .populate('user_id', 'name email')
      .populate('course_id', 'name description price')
      .lean();
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.model
      .findById(id)
      .populate('user_id', 'name email')
      .populate('course_id', 'name description price')
      .lean();
    if (!enrollment) throw new NotFoundException('Yozilish topilmadi');
    return enrollment;
  }

  async update(id: string, dto: UpdateEnrollmentDto): Promise<Enrollment> {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Yozilish topilmadi');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Yozilish topilmadi');
    return { message: 'Yozilish muvaffaqiyatli o‘chirildi' };
  }
}
