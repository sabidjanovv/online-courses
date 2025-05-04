import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Teacher extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true })
  bio: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
