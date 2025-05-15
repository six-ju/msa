import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true})
  number: number;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 0})
  amount: number;

  @Prop()
  info: string;

  @Prop({ default: Date.now})
  createdAt: Date;

  @Prop({ required: true })
  createdBy: string;
  
  @Prop({ default: Date.now})
  updatedAt: Date;
  
  @Prop({ required: true })
  updatedBy: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
