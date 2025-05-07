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
import { LessonCreateUpdateGuard } from '../common/guards/lessons-create.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { ModuleLessonsGuard } from '../common/guards/module-lessons.guard';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly service: LessonsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(LessonCreateUpdateGuard)
  @ApiOperation({ summary: 'Yangi dars qo‘shish' })
  create(@Body() dto: CreateLessonDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha darslarni olish' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Darsni ID orqali olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('module/:moduleId')
  @ApiBearerAuth()
  @UseGuards(ModuleLessonsGuard)
  @ApiOperation({
    summary: 'Oquvchi moduledagu barcha darslar ro‘yxatini olish',
  })
  @ApiParam({ name: 'moduleId', type: 'string', description: 'module ID' })
  @ApiResponse({ status: 200, description: 'Darslar muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 404, description: 'Darslar topilmadi.' })
  async getLessons(@Param('moduleId') moduleId: string) {
    return this.service.getModuleLessons(moduleId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(LessonCreateUpdateGuard)
  @ApiOperation({ summary: 'Darsni yangilash' })
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Darsni o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
