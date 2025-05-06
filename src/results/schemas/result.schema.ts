import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema({ timestamps: true, versionKey: false })
export class Result {
  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacher_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Submission', required: true })
  submission_id: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  score: number;

  @Prop({ type: String, required: true })
  feedback: string;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
