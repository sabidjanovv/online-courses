import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { Course } from './schemas/course.schema';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Yangi kurs yaratish' })
  @ApiCreatedResponse({ description: 'Kurs muvaffaqiyatli yaratildi' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha kurslarni olish' })
  @ApiOkResponse({ description: 'Barcha kurslar ro‘yxati' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Sahifa raqami (default 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Sahifadagi kurslar soni (default 10)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Kurs nomi bo‘yicha qidiruv',
    type: String,
    example: 'JavaScript',
  })
  @ApiQuery({
    name: 'category_id',
    required: false,
    description: 'Kurs kategoriya ID si bo‘yicha filtrlash',
    type: String,
    example: '631b9d515db4b0f30c543e67',
  })
  async findAll(@Query() paginationDto: PaginationDto): Promise<Course[]> {
    return this.coursesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha kursni olish' })
  @ApiOkResponse({ description: 'Bitta kurs topildi' })
  @ApiNotFoundResponse({ description: 'Kurs topilmadi' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Kursni yangilash' })
  @ApiOkResponse({ description: 'Kurs muvaffaqiyatli yangilandi' })
  @ApiNotFoundResponse({ description: 'Kurs topilmadi' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Kursni o‘chirish' })
  @ApiOkResponse({ description: 'Kurs o‘chirildi' })
  @ApiNotFoundResponse({ description: 'Kurs topilmadi' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
