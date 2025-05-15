import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true, unique: true })
  number: number;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 0})
  amount: number;

  @Prop()
  info: string;

  @Prop({ default: new Date()})
  createdAt: Date;

  @Prop({ required: true })
  createdBy: string;
  
  @Prop({ default: new Date()})
  updatedAt: Date;
  
  @Prop({ required: true })
  updatedBy: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
