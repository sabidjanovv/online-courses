import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from './schemas/assignment.schema';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectModel(Assignment.name) private model: Model<AssignmentDocument>,
  ) {}

  async create(dto: CreateAssignmentDto): Promise<Assignment> {
    return this.model.create(dto);
  }

  async findAll(): Promise<Assignment[]> {
    return this.model.find().populate('module_id', 'title').lean();
  }

  async findOne(id: string): Promise<Assignment> {
    const assignment = await this.model
      .findById(id)
      .populate('module_id', '-createdAt -updatedAt')
      .lean();
    if (!assignment) throw new NotFoundException('Topshiriq topilmadi');
    return assignment;
  }

  async update(id: string, dto: UpdateAssignmentDto): Promise<Assignment> {
    const updated = await this.model.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('Topshiriq topilmadi');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Topshiriq topilmadi');
    return { message: 'Topshiriq o‘chirildi' };
  }
}
