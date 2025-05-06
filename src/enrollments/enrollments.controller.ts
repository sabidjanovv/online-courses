import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Yangi yozilish yaratish' })
  @ApiResponse({ status: 201, description: 'Yozilish yaratildi' })
  create(@Body() dto: CreateEnrollmentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha yozilishlarni olish' })
  @ApiResponse({ status: 200, description: 'Yozilishlar ro‘yxati' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'ID bo‘yicha yozilishni olish' })
  @ApiResponse({ status: 200, description: 'Bitta yozilish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Yozilishni tahrirlash' })
  @ApiResponse({ status: 200, description: 'Yozilish yangilandi' })
  update(@Param('id') id: string, @Body() dto: UpdateEnrollmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Yozilishni o‘chirish' })
  @ApiResponse({ status: 200, description: 'O‘chirildi' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
