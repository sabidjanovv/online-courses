import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'argon2';
import { Response } from 'express';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { UserRole } from '../common/enums/enum';

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

  async findAll(paginationDto: PaginationDto, user: any): Promise<User[]> {
    const { page = 1, limit = 10, role } = paginationDto;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    console.log(user.role);

    if (user.role === 'admin') {
      filter.role = 'student';
    }

    if (user.role === 'superadmin' && role) {
      filter.role = role;
    }

    return this.userModel
      .find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(id: string, currentUser: any): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').lean();

    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const isSameUser = user._id.toString() === currentUser.id;

    if (
      currentUser.role === 'admin' &&
      (user.role === 'admin' || user.role === 'superadmin') &&
      !isSameUser
    ) {
      throw new ForbiddenException(
        'Bu foydalanuvchini ko‘rishga ruxsatingiz yo‘q',
      );
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: any,
  ): Promise<User> {
    const user = await this.userModel.findById(id).lean();

    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const isSameUser = user._id.toString() === currentUser.id;

    // Admin boshqa admin yoki superadminni yangilay olmasin (faqat o‘zini)
    if (
      currentUser.role === 'admin' &&
      (user.role === 'admin' || user.role === 'superadmin') &&
      !isSameUser
    ) {
      throw new ForbiddenException(
        'Bu foydalanuvchini yangilashga ruxsatingiz yo‘q',
      );
    }

    const updateData = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await hash(updateUserDto.password);
    }

    const updated = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .lean();

    if (!updated) throw new NotFoundException('Yangilashda xatolik yuz berdi');

    return updated;
  }

  async remove(id: string, currentUser: any): Promise<{ message: string }> {
    const user = await this.userModel.findById(id).lean();

    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const isSameUser = user._id.toString() === currentUser.id;

    if (
      currentUser.role === 'admin' &&
      (user.role === 'admin' || user.role === 'superadmin') &&
      !isSameUser
    ) {
      throw new ForbiddenException(
        'Bu foydalanuvchini o‘chirishga ruxsatingiz yo‘q',
      );
    }

    await this.userModel.findByIdAndDelete(id);

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
