import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission, SubmissionDocument } from './schemas/submission.schema';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private model: Model<SubmissionDocument>,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    return await this.model.create(dto);
  }

  async findAll(): Promise<Submission[]> {
    return await this.model
      .find()
      .populate('assignment_id')
      .populate('user_id', '_id name email role');
  }

  async findOne(id: string): Promise<Submission> {
    const submission = await this.model
      .findById(id)
      .populate('assignment_id')
      .populate('user_id', '_id name email role');
    if (!submission) throw new NotFoundException('Topshiruv topilmadi');
    return submission;
  }

  async update(id: string, dto: UpdateSubmissionDto): Promise<Submission> {
    const updated = await this.model.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('Topshiruv topilmadi');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Topshiruv topilmadi');
    return { message: 'Topshiruv muvaffaqiyatli o‘chirildi' };
  }
}
