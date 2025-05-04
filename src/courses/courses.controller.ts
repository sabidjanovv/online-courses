import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
} from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi kurs yaratish' })
  @ApiCreatedResponse({ description: 'Kurs muvaffaqiyatli yaratildi' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha kurslarni olish' })
  @ApiOkResponse({ description: 'Barcha kurslar ro‘yxati' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha kursni olish' })
  @ApiOkResponse({ description: 'Bitta kurs topildi' })
  @ApiNotFoundResponse({ description: 'Kurs topilmadi' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Kursni yangilash' })
  @ApiOkResponse({ description: 'Kurs muvaffaqiyatli yangilandi' })
  @ApiNotFoundResponse({ description: 'Kurs topilmadi' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Kursni o‘chirish' })
  @ApiOkResponse({ description: 'Kurs o‘chirildi' })
  @ApiNotFoundResponse({ description: 'Kurs topilmadi' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
