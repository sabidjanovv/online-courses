import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true, versionKey: false })
export class Teacher {
  @ApiProperty({
    example: 'Aliyev Alisher',
    description: "O'qituvchining F.I.Sh",
  })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    example: '10 yillik tajriba, PhD darajasi',
    description: "O'qituvchining tajribasi yoki bio ma'lumotlari",
  })
  @Prop({ type: String, required: true })
  bio: string;

  @ApiProperty({
    example: 'alisher123',
    description: "O'qituvchining login (foydalanuvchi nomi)",
  })
  @Prop({ type: String, required: true, unique: true })
  login: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: "O'qituvchining paroli (maxfiy)",
  })
  @Prop({ type: String, required: true })
  password: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
