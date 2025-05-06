import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi muvaffaqiyatli yaratildi',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Barcha foydalanuvchilar ro‘yxati' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'role', required: false, type: String, example: 'student' })
  async findAll(@Query() paginationDto: PaginationDto, @Request() req) {
    console.log(req.user);

    return await this.usersService.findAll(paginationDto, req.user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'ID bo‘yicha foydalanuvchini olish' })
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.usersService.findOne(id, req.user);
  }

  @Get('activate/:link')
  @ApiOperation({ summary: 'Link orqali Userni faollashtirish' })
  @ApiParam({ name: 'link', description: 'Aktivatsiya linki' })
  activateUser(@Param('link') link: string, @Res() res: Response) {
    return this.usersService.activateUser(link, res);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchini yangilash' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return await this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchini o‘chirish' })
  async remove(@Param('id') id: string, @Request() req) {
    return await this.usersService.remove(id, req.user);
  }
}
