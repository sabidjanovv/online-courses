import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModuleDocument = Modules & Document;


@Schema({ timestamps: true, versionKey: false })
export class Modules extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course_id: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  order: number;
}

export const ModuleSchema = SchemaFactory.createForClass(Modules);
