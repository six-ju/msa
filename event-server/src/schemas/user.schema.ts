import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  ID: string;

  @Prop({ required: true })
  PW: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  loginAt: Date;

  @Prop({ default: 0 })
  loginCount: number;

  @Prop({ default: 0 })
  recommend: number;

  @Prop({ default: 0 })
  money: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
