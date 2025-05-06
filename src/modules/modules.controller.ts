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

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly service: ModulesService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi modul qo‘shish' })
  create(@Body() dto: CreateModuleDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha modullarni olish' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards()
  @ApiOperation({ summary: 'Modulni ID orqali olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('course/:courseId')
  @ApiBearerAuth()
  @UseGuards(EnrollmentGuard)
  @ApiOperation({ summary: 'Kursga tegishli modullar ro‘yxatini olish' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Kurs ID' })
  @ApiResponse({ status: 200, description: 'Modullar muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 404, description: 'Modullar topilmadi.' })
  @ApiResponse({ status: 403, description: 'Foydalanuvchi kursga yozilmagan.' })
  async getModules(@Param('courseId') courseId: string) {
    return this.service.getCourseModules(courseId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modulni yangilash' })
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Modulni o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
