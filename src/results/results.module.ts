import { Module } from '@nestjs/common';
import { ResultService } from './results.service';
import { ResultController } from './results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './schemas/result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
  ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultsModule {}
