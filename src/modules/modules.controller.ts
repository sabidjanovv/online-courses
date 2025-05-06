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
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { EnrollmentGuard } from '../common/guards/enrollment.guard';
import { TeacherAndAdminModuleGuard } from '../common/guards/module-create.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly service: ModulesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(TeacherAndAdminModuleGuard)
  @ApiOperation({ summary: 'Yangi modul qo‘shish' })
  create(@Body() dto: CreateModuleDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha modullarni olish' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Modulni ID orqali olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('course/:courseId')
  @ApiBearerAuth()
  @UseGuards(EnrollmentGuard)
  @ApiOperation({
    summary: 'Oquvchi kursga tegishli modullar ro‘yxatini olish',
  })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Kurs ID' })
  @ApiResponse({ status: 200, description: 'Modullar muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 404, description: 'Modullar topilmadi.' })
  @ApiResponse({ status: 403, description: 'Foydalanuvchi kursga yozilmagan.' })
  async getModules(@Param('courseId') courseId: string) {
    return this.service.getCourseModules(courseId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(TeacherAndAdminModuleGuard)
  @ApiOperation({ summary: 'Modulni yangilash' })
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.service.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Modulni o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
