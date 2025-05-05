import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResultService } from './results.service';

@ApiTags('Results')
@Controller('results')
export class ResultController {
  constructor(private readonly service: ResultService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi natija yaratish' })
  @ApiResponse({ status: 201, description: 'Natija yaratildi' })
  create(@Body() dto: CreateResultDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha natijalarni olish' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID orqali natijani olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ID orqali natijani yangilash' })
  update(@Param('id') id: string, @Body() dto: UpdateResultDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ID orqali natijani o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
