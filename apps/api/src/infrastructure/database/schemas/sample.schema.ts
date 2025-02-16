import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TestType } from '../../../domain/value-objects/test-type.vo';

@Schema({ timestamps: true, collection: 'samples' })
export class SampleDocument extends Document {
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true })
  filePath: string;

  @Prop({ required: true, type: [String], enum: TestType })
  testTypes: TestType[];

  @Prop({ required: true })
  coughCount: number;
}

export const SampleSchema = SchemaFactory.createForClass(SampleDocument);
