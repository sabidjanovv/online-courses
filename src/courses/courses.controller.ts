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
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { EnrollmentGuard } from '../common/guards/enrollment.guard';

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

  @Get(':courseId/modules')
  @ApiBearerAuth()
  @UseGuards(EnrollmentGuard)
  @ApiOperation({ summary: 'Kursga tegishli modullar ro‘yxatini olish' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Kurs ID' })
  @ApiResponse({ status: 200, description: 'Modullar muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 404, description: 'Modullar topilmadi.' })
  @ApiResponse({ status: 403, description: 'Foydalanuvchi kursga yozilmagan.' })
  async getModules(@Param('courseId') courseId: string) {
    return this.coursesService.getCourseModules(courseId);
  }

  @Get(':courseId/lessons')
  @ApiBearerAuth()
  @UseGuards(EnrollmentGuard)
  @ApiOperation({ summary: 'Kursdagi barcha darslar ro‘yxatini olish' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Kurs ID' })
  @ApiResponse({ status: 200, description: 'Darslar muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 404, description: 'Darslar topilmadi.' })
  @ApiResponse({ status: 403, description: 'Foydalanuvchi kursga yozilmagan.' })
  async getLessons(@Param('courseId') courseId: string) {
    return this.coursesService.getCourseLessons(courseId);
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
