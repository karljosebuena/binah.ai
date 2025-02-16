import { TestType } from '../../domain/value-objects/test-type.vo';
import { ProcessingStatus } from '../../domain/value-objects/processing-status.vo';

export class TestResultDto {
  id: string;
  sampleId: string;
  userId: string;
  testType: TestType;
  confidenceScore: number;
  processingStatus: ProcessingStatus;
  interpretation: string;
  recommendation: string;
  createdAt: Date;
  updatedAt: Date;
}
