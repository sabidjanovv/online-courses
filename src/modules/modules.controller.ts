import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Modulni ID orqali olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
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
