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
import { hash } from 'argon2';
import { Response } from 'express';

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

    const hashedPassword = await hash(createUserDto.password);
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
      .sort({ createdAt: 'desc' })
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
      updateData.password = await hash(updateUserDto.password);
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

  async activateUser(link: string, res: Response) {
    try {
      const user = await this.userModel.findOne({ activation_link: link });

      if (!user) {
        return res.status(400).send({ message: 'user topilmadi!' });
      }

      if (user.isActive) {
        return res
          .status(400)
          .send({ message: 'user allaqachon aktivlashtirilgan.' });
      }

      user.isActive = true;
      await user.save();

      return res.send({
        isActive: user.isActive,
        message: 'user muvaffaqiyatli aktivlashtirildi.',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Serverda xatolik yuz berdi' });
    }
  }
}
