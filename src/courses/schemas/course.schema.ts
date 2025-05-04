import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CourseLevel } from '../../common/enums/enum';

@Schema({ timestamps: true, versionKey: false })
export class Course extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, enum: CourseLevel })
  level: CourseLevel;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacher_id: Types.ObjectId;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
