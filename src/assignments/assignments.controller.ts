import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssignmentService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly service: AssignmentService) {}

  @Post()
  @ApiOperation({ summary: 'Topshiriq yaratish' })
  @ApiResponse({ status: 201, description: 'Topshiriq yaratildi' })
  create(@Body() dto: CreateAssignmentDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha topshiriqlarni olish' })
  @ApiResponse({ status: 200, description: 'Topshiriqlar ro‘yxati' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Topshiriqni ID orqali olish' })
  @ApiParam({ name: 'id', description: 'Topshiriq IDsi' })
  @ApiResponse({ status: 200, description: 'Topshiriq topildi' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Topshiriqni yangilash' })
  @ApiParam({ name: 'id', description: 'Topshiriq IDsi' })
  update(@Param('id') id: string, @Body() dto: UpdateAssignmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Topshiriqni o‘chirish' })
  @ApiParam({ name: 'id', description: 'Topshiriq IDsi' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
