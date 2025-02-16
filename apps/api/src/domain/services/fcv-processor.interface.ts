import { TestType } from '../value-objects/test-type.vo';
import { ConfidenceScore } from '../value-objects/confidence-score.vo';
import { ProcessingStatusVO } from '../value-objects/processing-status.vo';

export interface IFCVProcessor {
  processSample(
    filePath: string,
    testType: TestType,
  ): Promise<{
    confidenceScore: ConfidenceScore;
    status: ProcessingStatusVO;
  }>;
}
