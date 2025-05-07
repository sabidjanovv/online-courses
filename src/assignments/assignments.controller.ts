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
import { AssignmentService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AssignmentGuard } from '../common/guards/assignment.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly service: AssignmentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AssignmentGuard)
  @ApiOperation({ summary: 'Topshiriq yaratish' })
  @ApiResponse({ status: 201, description: 'Topshiriq yaratildi' })
  create(@Body() dto: CreateAssignmentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha topshiriqlarni olish' })
  @ApiResponse({ status: 200, description: 'Topshiriqlar ro‘yxati' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Topshiriqni ID orqali olish' })
  @ApiParam({ name: 'id', description: 'Topshiriq IDsi' })
  @ApiResponse({ status: 200, description: 'Topshiriq topildi' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AssignmentGuard)
  @ApiOperation({ summary: 'Topshiriqni yangilash' })
  @ApiParam({ name: 'id', description: 'Topshiriq IDsi' })
  update(@Param('id') id: string, @Body() dto: UpdateAssignmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Topshiriqni o‘chirish' })
  @ApiParam({ name: 'id', description: 'Topshiriq IDsi' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
