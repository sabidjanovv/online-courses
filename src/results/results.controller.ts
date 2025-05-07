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
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResultService } from './results.service';
import { ResultGuard } from '../common/guards/result.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Results')
@Controller('results')
export class ResultController {
  constructor(private readonly service: ResultService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(ResultGuard)
  @ApiOperation({ summary: 'Yangi natija yaratish' })
  @ApiResponse({ status: 201, description: 'Natija yaratildi' })
  create(@Body() dto: CreateResultDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha natijalarni olish' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'ID orqali natijani olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(ResultGuard)
  @ApiOperation({ summary: 'ID orqali natijani yangilash' })
  update(@Param('id') id: string, @Body() dto: UpdateResultDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'ID orqali natijani o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
