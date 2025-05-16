import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HistoryDocument = History & Document;

@Schema()
export class History {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventNum: string;

  @Prop({ default: false})
  status: string;

  @Prop()
  remark: string;

  @Prop({default: Date.now})
  createdAt: Date;

  @Prop({ required: true })
  createdBy: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
