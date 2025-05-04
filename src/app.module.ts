import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TeachersModule } from './teachers/teachers.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    UsersModule,
    CategoriesModule,
    TeachersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
