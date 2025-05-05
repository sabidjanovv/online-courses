import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema, Modules } from './schemas/module.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Modules.name, schema:ModuleSchema}])],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
