import { ApiProperty } from '@nestjs/swagger';
import { TestType } from '../../domain/value-objects/test-type.vo';
import { ProcessingStatus } from '../../domain/value-objects/processing-status.vo';

export class TestResultDto {
  @ApiProperty({ description: 'Unique identifier for the test result' })
  id: string;

  @ApiProperty({ description: 'ID of the associated sample' })
  sampleId: string;

  @ApiProperty({ description: 'ID of the user who submitted the sample' })
  userId: string;

  @ApiProperty({ enum: TestType, description: 'Type of test performed' })
  testType: TestType;

  @ApiProperty({ 
    description: 'Confidence score of the test result',
    minimum: 0,
    maximum: 1
  })
  confidenceScore: number;

  @ApiProperty({ enum: ProcessingStatus, description: 'Current status of the processing' })
  processingStatus: ProcessingStatus;

  @ApiProperty({ description: 'Human-readable interpretation of the result' })
  interpretation: string;

  @ApiProperty({ description: 'Recommended actions based on the result' })
  recommendation: string;

  @ApiProperty({ description: 'When the result was created' })
  createdAt: Date;

  @ApiProperty({ description: 'When the result was last updated' })
  updatedAt: Date;
}
