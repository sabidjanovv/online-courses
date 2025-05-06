import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EnrollmentGuard } from '../common/guards/enrollment.guard';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly service: LessonsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi dars qo‘shish' })
  create(@Body() dto: CreateLessonDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha darslarni olish' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Darsni ID orqali olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('course/:courseId')
  @ApiBearerAuth()
  @UseGuards(EnrollmentGuard)
  @ApiOperation({ summary: 'Kursdagi barcha darslar ro‘yxatini olish' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Kurs ID' })
  @ApiResponse({ status: 200, description: 'Darslar muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 404, description: 'Darslar topilmadi.' })
  @ApiResponse({ status: 403, description: 'Foydalanuvchi kursga yozilmagan.' })
  async getLessons(@Param('courseId') courseId: string) {
    return this.service.getCourseLessons(courseId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Darsni yangilash' })
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Darsni o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
