import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Modules } from '../../modules/schemas/module.schema';

export type LessonDocument = Lesson & Document;

@Schema({ timestamps: true, versionKey: false })
export class Lesson {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Modules', required: true })
  module_id: Types.ObjectId;

  @Prop({ required: false })
  order: number;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
