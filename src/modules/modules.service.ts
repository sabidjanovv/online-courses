import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Modules } from './schemas/module.schema';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(@InjectModel(Modules.name) private model: Model<Modules>) {}

  async create(dto: CreateModuleDto): Promise<Modules> {
    return await this.model.create(dto);
  }

  async findAll(): Promise<Modules[]> {
    return this.model
      .find()
      .populate('course_id')
      .sort({ createdAt: 'desc' })
      .lean();
  }

  async findOne(id: string): Promise<Modules> {
    const module = await this.model.findById(id).populate('course_id').lean();
    if (!module) throw new NotFoundException('Modull topilmadi');
    return module;
  }

  async getCourseModules(course_id: string): Promise<Modules[]> {
    console.log(course_id);
    
    const modules = await this.model.find({ course_id });
    if (!modules.length) {
      throw new NotFoundException('Modullar topilmadi!');
    }

    return modules;
  }

  async update(id: string, dto: UpdateModuleDto): Promise<Modules> {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Modul topilmadi');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Modul topilmadi');
    return { message: 'Modul o‘chirildi' };
  }
}
