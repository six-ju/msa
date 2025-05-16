import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  reward: Array<number>;

  @Prop({ default: new Date()})
  startAt: Date;

  @Prop({ default: new Date()})
  endAt: Date;

  @Prop({ default: false})
  status: boolean;

  @Prop({ default: false})
  eventType: string;

  @Prop({default: Date.now})
  createdAt: Date;

  @Prop({ required: true })
  createdBy: string;
  
  @Prop({ default: Date.now})
  updatedAt: Date;
  
  @Prop({ required: true })
  updatedBy: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
