import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskType } from '../../common/enums/enum';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true, versionKey: false })
export class Assignment {
  @Prop({ type: Types.ObjectId, ref: 'Modules', required: true })
  module_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  question: string;

  @Prop({ type: String, enum: TaskType, required: true })
  type: TaskType;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
