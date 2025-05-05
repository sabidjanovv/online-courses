import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema({ timestamps: true, versionKey: false })
export class Result {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course_id: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  score: number;

  @Prop({ type: Boolean, default: false })
  completed: boolean;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
