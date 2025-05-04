import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userModel
      .findOne({ email: createUserDto.email })
      .lean();
    if (existing) {
      throw new ConflictException('Bu email allaqachon ro‘yxatdan o‘tgan');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel
      .find()
      .select('-password')
      .sort({ createdAt: "desc" })
      .lean();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').lean();
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateData = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updated = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .lean();

    if (!updated) throw new NotFoundException('Foydalanuvchi topilmadi');

    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.userModel.findByIdAndDelete(id).lean();
    if (!deleted) throw new NotFoundException('Foydalanuvchi topilmadi');
    return { message: 'Foydalanuvchi o‘chirildi' };
  }
}
