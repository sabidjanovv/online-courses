import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  _id: string;

  @ApiProperty({ example: 'Ali Valiyev' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'ali@gmail.com' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: 'password' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: 'student', enum: UserRole })
  @Prop({ type: String, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop({ type: String, default: null })
  activation_link: string;

  @Prop({ type: String, default: null })
  hashed_refresh_token?: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
