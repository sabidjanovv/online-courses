import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubmissionService } from './submissions.service';
import { SubmissionGuard } from '../common/guards/submission.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(SubmissionGuard)
  @ApiOperation({ summary: 'Yangi topshiruv qo‘shish' })
  create(@Body() dto: CreateSubmissionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha topshiruvlarni olish' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(SubmissionGuard)
  @ApiOperation({ summary: 'ID bo‘yicha topshiruvni olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(SubmissionGuard)
  @ApiOperation({ summary: 'Topshiruvni yangilash' })
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Topshiruvni o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
