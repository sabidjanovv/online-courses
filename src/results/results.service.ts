import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Result, ResultDocument } from './schemas/result.schema';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result.name) private readonly model: Model<ResultDocument>,
  ) {}

  async create(dto: CreateResultDto): Promise<Result> {
    return await this.model.create(dto);
  }

  async findAll(): Promise<Result[]> {
    return await this.model
      .find()
      .populate('user_id', '_id name email role')
      .populate('course_id');
  }

  async findOne(id: string): Promise<Result> {
    const result = await this.model
      .findById(id)
      .populate('user_id', '_id name email role')
      .populate('course_id');
    if (!result) throw new NotFoundException('Natija topilmadi');
    return result;
  }

  async update(id: string, dto: UpdateResultDto): Promise<Result> {
    const updated = await this.model.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('Natija topilmadi');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Natija topilmadi');
    return { message: 'Natija o‘chirildi' };
  }
}
