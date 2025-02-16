import { TestType } from '../value-objects/test-type.vo';
import { ConfidenceScore } from '../value-objects/confidence-score.vo';
import { ProcessingStatus, ProcessingStatusVO } from '../value-objects/processing-status.vo';

export class TestResult {
  constructor(
    private readonly id: string,
    private readonly sampleId: string,
    private readonly userId: string,
    private readonly testType: TestType,
    private readonly confidenceScore: ConfidenceScore,
    private readonly processingStatus: ProcessingStatusVO,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  getId(): string {
    return this.id;
  }

  getSampleId(): string {
    return this.sampleId;
  }

  getUserId(): string {
    return this.userId;
  }

  getTestType(): TestType {
    return this.testType;
  }

  getConfidenceScore(): ConfidenceScore {
    return this.confidenceScore;
  }

  getProcessingStatus(): ProcessingStatusVO {
    return this.processingStatus;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  isProcessingComplete(): boolean {
    return this.processingStatus.isComplete();
  }

  isProcessingSuccessful(): boolean {
    return this.processingStatus.isSuccess();
  }
}
