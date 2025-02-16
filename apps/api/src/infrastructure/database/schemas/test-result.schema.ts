import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TestType } from '../../../domain/value-objects/test-type.vo';
import { ProcessingStatus } from '../../../domain/value-objects/processing-status.vo';

@Schema({ timestamps: true, collection: 'test_results' })
export class TestResultDocument extends Document {
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
  @Prop({ required: true })
  sampleId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: TestType })
  testType: TestType;

  @Prop({ required: true, min: 0, max: 1 })
  confidenceScore: number;

  @Prop({ required: true, enum: ProcessingStatus })
  processingStatus: ProcessingStatus;
}

export const TestResultSchema = SchemaFactory.createForClass(TestResultDocument);
