import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({
  timestamps: { createdAt: 'submitted_at', updatedAt: true },
  versionKey: false,
})
export class Submission {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Assignment' })
  assignment_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user_id: string;

  @Prop({ type: String, required: true })
  answer: string;

  @Prop({ type: Number, required: false, default: null })
  score?: number;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
