import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'enrolled_at', updatedAt: true },
  versionKey: false,
})
export class Enrollment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course_id: Types.ObjectId;

  @Prop({ default: Date.now })
  enrolled_at: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
